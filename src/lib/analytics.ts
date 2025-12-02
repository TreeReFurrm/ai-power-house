
'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import Ajv, { ValidateFunction } from 'ajv';
import schema from '../../docs/analytics-schema.json';
import { User } from 'firebase/auth';

// --- CONFIGURATION ---
const ANALYTICS_ENDPOINT = "https://your-analytics-endpoint.example.com/ingest";
const BATCH_SIZE = 20;
const BATCH_INTERVAL_MS = 5000; // 5 seconds

// --- TYPE DEFINITIONS ---
// Dynamically create a type for all possible event names from the schema
type EventName = keyof typeof schema.components.schemas;

// The shape of the context provided to components
interface AnalyticsContextType {
  trackEvent: <T extends EventName>(
    eventName: T,
    properties: Omit<
      (typeof schema.components.schemas)[T] extends { allOf: any[] }
        ? (typeof schema.components.schemas)[T]['allOf'][1]['properties']
        : (typeof schema.components.schemas)[T]['properties'],
      | 'event'
      | 'user_id'
      | 'anonymous_id'
      | 'session_id'
      | 'page'
      | 'page_url'
      | 'timestamp'
    >
  ) => void;
}

// --- CONTEXT & PROVIDER ---
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children, user }: { children: ReactNode; user: User | null }) {
  const analyticsClient = useMemo(() => createAnalyticsClient(user), [user]);

  return (
    <AnalyticsContext.Provider value={analyticsClient}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}


// --- CORE ANALYTICS CLIENT LOGIC ---
function createAnalyticsClient(user: User | null): AnalyticsContextType {
  // --- HELPERS ---
  const nowIso = () => new Date().toISOString();
  
  const getPageContext = () => ({
    page: window.location.pathname.slice(1) || 'home',
    page_url: window.location.href,
  });

  const getSessionId = () => {
    let s = sessionStorage.getItem("session_id");
    if (!s) {
      s = "sess_" + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem("session_id", s);
    }
    return s;
  };

  const getAnonId = () => {
    let a = localStorage.getItem("anon_id");
    if (!a) {
      a = "anon_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("anon_id", a);
    }
    return a;
  };

  // --- SCHEMA VALIDATION (AJV) ---
  const ajv = new Ajv({ strict: false });
  const validators: Record<string, ValidateFunction> = {};
  
  try {
    ajv.addSchema(schema, 'analytics-schema');
    Object.keys(schema.components.schemas).forEach((key) => {
        const validator = ajv.getSchema(`analytics-schema#/components/schemas/${key}`);
        if(validator) {
            validators[key] = validator;
        }
    });
  } catch(e) {
      console.error("Error compiling analytics schemas:", e);
  }

  // --- EVENT QUEUE & SENDER ---
  const eventQueue: any[] = [];
  let flushTimer: NodeJS.Timeout | null = null;

  const flushNow = async () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (!eventQueue.length) return;

    const batch = [...eventQueue];
    eventQueue.length = 0; // Clear the queue

    console.log('[Analytics] Flushing batch:', batch);

    // In a real implementation, you would send the data to your endpoint.
    // The placeholder function is kept here for demonstration.
    try {
        // Example:
        // await fetch(ANALYTICS_ENDPOINT, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ events: batch }),
        //   keepalive: true
        // });
    } catch (err) {
      console.error("Analytics send failed", err);
      // Re-enqueue failed batch for retry
      eventQueue.unshift(...batch);
    }
  };

  const enqueueEvent = (eventPayload: object) => {
    eventQueue.push(eventPayload);
    if (eventQueue.length >= BATCH_SIZE) {
      flushNow();
      return;
    }
    if (!flushTimer) {
      flushTimer = setTimeout(flushNow, BATCH_INTERVAL_MS);
    }
  };

  // --- TRACK EVENT FUNCTION ---
  const trackEvent: AnalyticsContextType['trackEvent'] = (eventName, properties) => {
    const base = {
      event: eventName,
      user_id: user?.uid || null,
      anonymous_id: getAnonId(),
      session_id: getSessionId(),
      ...getPageContext(),
      timestamp: nowIso(),
    };

    const payload = { ...base, ...properties };
    const validate = validators[eventName];

    if (!validate) {
      console.warn("No validator for event", eventName);
      return;
    }

    const valid = validate(payload);
    if (!valid) {
      console.error("Analytics schema validation failed", eventName, validate.errors, payload);
      return; // Do not send invalid payload
    }

    enqueueEvent(payload);
  };
  
  // Return the public interface
  return { trackEvent };
}
