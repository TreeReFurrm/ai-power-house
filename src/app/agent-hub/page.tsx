
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, FileCheck, FolderArchive, Hourglass, ListTodo } from 'lucide-react';

// Mock Data based on the defined schema
const mockUnits = [
    { unit_id: 'AUCT-2025-001', facility_ref: 'Main St. Storage #C-14', agent_id: 'AGENT_01', start_timestamp: '2024-05-23T10:00:00Z', status: 'In Progress' },
    { unit_id: 'AUCT-2025-002', facility_ref: 'Downtown Bids Lot 7', agent_id: 'AGENT_01', start_timestamp: '2024-05-22T14:00:00Z', status: 'Review' },
    { unit_id: 'AUCT-2025-003', facility_ref: 'SelfStore USA #A-01', agent_id: 'AGENT_02', start_timestamp: '2024-05-21T09:00:00Z', end_timestamp: '2024-05-21T11:30:00Z', status: 'Complete' },
];

const mockItems = [
    { item_id: 'TAG-001', unit_id: 'AUCT-2025-002', ai_classification: 'Sensitive', is_sensitive: true, agent_decision: null, item_photo_url: 'https://picsum.photos/seed/1/40/40' },
    { item_id: 'TAG-002', unit_id: 'AUCT-2025-002', ai_classification: 'Resale', is_sensitive: false, agent_decision: 'Price', item_photo_url: 'https://picsum.photos/seed/2/40/40' },
    { item_id: 'TAG-003', unit_id: 'AUCT-2025-002', ai_classification: 'Resale', is_sensitive: false, agent_decision: null, item_photo_url: 'https://picsum.photos/seed/3/40/40' },
];


export default function AgentHubPage() {
    const sensitiveItemsCount = mockItems.filter(item => item.is_sensitive && !item.agent_decision).length;

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Agent Hub</h1>
        <p className="text-muted-foreground">
          Manage unit intake, chain-of-custody, and item disposition.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Units</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUnits.filter(u => u.status === 'In Progress').length}</div>
            <p className="text-xs text-muted-foreground">Units currently being processed.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Intake Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 Hours</div>
            <p className="text-xs text-muted-foreground">Average time from start to final sign-off.</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 border-destructive/50 bg-destructive/10 text-destructive-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Compliance Center</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{sensitiveItemsCount}</div>
                <p className="text-xs text-destructive/80">Sensitive items awaiting mandatory review.</p>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active"><ListTodo className="mr-2 h-4 w-4" />Active Units</TabsTrigger>
          <TabsTrigger value="review">
            <AlertCircle className="mr-2 h-4 w-4" />Awaiting Review <Badge variant="destructive" className="ml-2">{sensitiveItemsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pricing"><FileCheck className="mr-2 h-4 w-4" />Awaiting Pricing</TabsTrigger>
          <TabsTrigger value="archive"><FolderArchive className="mr-2 h-4 w-4" />Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Active Units</CardTitle>
                    <CardDescription>Units that are currently in the intake process.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit ID</TableHead>
                                <TableHead>Facility Ref.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUnits.filter(u => u.status === 'In Progress').map(unit => (
                                <TableRow key={unit.unit_id}>
                                    <TableCell className="font-mono">{unit.unit_id}</TableCell>
                                    <TableCell>{unit.facility_ref}</TableCell>
                                    <TableCell><Badge>{unit.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm">Continue Scan</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="review" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Awaiting Review</CardTitle>
                    <CardDescription>Items flagged by AI as sensitive that require your decision.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item ID</TableHead>
                                <TableHead>Unit ID</TableHead>
                                <TableHead>Classification</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {mockItems.filter(item => item.is_sensitive && !item.agent_decision).map(item => (
                                <TableRow key={item.item_id}>
                                    <TableCell className="font-mono">{item.item_id}</TableCell>
                                    <TableCell className="font-mono">{item.unit_id}</TableCell>
                                    <TableCell><Badge variant="destructive">{item.ai_classification}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="destructive">Review & Decide</Button>
                                    </TableCell>
                                </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Awaiting Pricing</CardTitle>
                    <CardDescription>Items approved for resale that are ready for the pricing and listing team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">No items are currently awaiting pricing.</p>
                </CardContent>
             </Card>
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Archive</CardTitle>
                    <CardDescription>Completed and finalized unit logs for auditing and historical reference.</CardDescription>
                </CardHeader>
                <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit ID</TableHead>
                                <TableHead>Facility Ref.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUnits.filter(u => u.status === 'Complete').map(unit => (
                                <TableRow key={unit.unit_id}>
                                    <TableCell className="font-mono">{unit.unit_id}</TableCell>
                                    <TableCell>{unit.facility_ref}</TableCell>
                                    <TableCell><Badge variant="secondary">{unit.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline">View Log</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
