
'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import Ajv, { ValidateFunction } from 'ajv';
import schema from '../../docs/analytics-schema.json';
import { User } from 'firebase/auth';

// --- CONFIGURATION ---
const ANALYTICS_ENDPOINT = "https://your-analytics-endpoint.example.com/ingest"; // Replace
const BATCH_SIZE = 20;
const BATCH_INTERVAL_MS = 5000; // flush every 5s

// --- TYPES ---
export type AnalyticsEventName = keyof typeof schema.components.schemas;
export type AnalyticsEventPayload<T extends AnalyticsEventName> = {
  [K in T]: (typeof schema.components.schemas)[K] extends { properties: infer P } ? P : {}
}[T];

// --- CONTEXT HELPERS ---
function nowIso(): string { return new Date().toISOString(); }

function getPageContext(): { page: string; page_url: string } {
    if (typeof window === 'undefined') return { page: 'server', page_url: '' };
    return {
        page: document.title || 'Unknown Page',
        page_url: window.location.href,
    };
}

function getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session';
    let s = sessionStorage.getItem("session_id");
    if (!s) {
        s = "sess_" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem("session_id", s);
    }
    return s;
}

function getAnonId(): string {
    if (typeof window === 'undefined') return 'server-anon';
    let a = localStorage.getItem("anon_id");
    if (!a) {
        a = "anon_" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem("anon_id", a);
    }
    return a;
}


// --- INITIALIZATION ---
const ajv = new Ajv({ schemas: [schema], strict: false });

const validators: Record<string, ValidateFunction> = {};
Object.keys(schema.components.schemas).forEach((key) => {
    validators[key] = ajv.getSchema(`analytics#/components/schemas/${key}`)!;
});


// --- BATCHING & SENDING ---
let eventQueue: any[] = [];
let flushTimer: NodeJS.Timeout | null = null;

function enqueueEvent(eventPayload: any) {
    eventQueue.push(eventPayload);
    if (eventQueue.length >= BATCH_SIZE) {
        flushNow();
        return;
    }
    if (!flushTimer) {
        flushTimer = setTimeout(() => {
            flushNow();
        }, BATCH_INTERVAL_MS);
    }
}

async function flushNow() {
    if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }
    if (!eventQueue.length || typeof window === 'undefined') return;
    
    const batch = [...eventQueue];
    eventQueue = [];

    try {
        console.log('Flushing analytics batch:', batch);
        // In a real app, you would send this to your analytics API
        // For now, we just log it.
        // await fetch(ANALYTICS_ENDPOINT, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ events: batch }),
        //     keepalive: true
        // });
    } catch (err) {
        console.error("Analytics send failed", err);
        // Re-enqueue failed events
        eventQueue.unshift(...batch);
    }
}


// --- CORE TRACKING FUNCTION ---
export function trackEvent<T extends AnalyticsEventName>(
    eventName: T,
    properties: AnalyticsEventPayload<T>,
    user: User | null
) {
    if (typeof window === 'undefined') return;

    const base = {
        event: eventName,
        anonymous_id: getAnonId(),
        session_id: getSessionId(),
        ...getPageContext(),
        timestamp: nowIso(),
        user_id: user?.uid || null,
    };
    
    const payload = { ...properties, ...base };

    const validate = validators[eventName];
    if (!validate) {
        console.warn("No validator for event", eventName);
        return;
    }

    const valid = validate(payload);
    if (!valid) {
        console.error("Analytics schema validation failed", eventName, validate.errors, payload);
        return; // Do not send invalid payloads
    }

    enqueueEvent(payload);
}
