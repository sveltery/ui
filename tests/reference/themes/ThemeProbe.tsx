// Supplemental source-derived harness; every wrapper import is an immutable upstream fixture.
import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '../card';
import { Textarea } from '../textarea';
import { Label } from '../label';
import { Skeleton } from '../skeleton';
import { Kbd, KbdGroup } from '../kbd';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '../table';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '../alert';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '../empty';
import { AspectRatio } from '../aspect-ratio';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../dialog';
export function ThemeProbe() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}><div data-theme-gallery className="grid gap-6">
    <div className="flex flex-wrap gap-2"><Button>Default</Button><Button variant="outline">Outline</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Destructive</Button><Button variant="link">Link</Button></div>
    <Card><CardHeader><CardTitle>Theme card</CardTitle><CardDescription>Card description</CardDescription><CardAction>Action</CardAction></CardHeader><CardContent>Card content</CardContent><CardFooter>Card footer</CardFooter></Card>
    <div className="grid gap-2"><Label htmlFor="theme-notes">Notes</Label><Textarea id="theme-notes" placeholder="Write a note" aria-invalid="true" /><Textarea disabled placeholder="Disabled note" /></div>
    <Skeleton className="h-4 w-32" /><KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
    <Table><TableCaption>Theme ledger</TableCaption><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader><TableBody><TableRow data-state="selected"><TableCell>Example</TableCell><TableCell>$10</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell>Total</TableCell><TableCell>$10</TableCell></TableRow></TableFooter></Table>
    <Alert variant="destructive"><AlertTitle>Theme alert</AlertTitle><AlertDescription>Alert description</AlertDescription><AlertAction>Action</AlertAction></Alert>
    <Empty><EmptyHeader><EmptyMedia variant="icon"><span>?</span></EmptyMedia><EmptyTitle>Nothing here</EmptyTitle><EmptyDescription>Empty description</EmptyDescription></EmptyHeader><EmptyContent>Empty content</EmptyContent></Empty>
    <AspectRatio ratio={16 / 9} className="bg-muted">Ratio</AspectRatio>
    <Dialog><DialogTrigger>Open theme dialog</DialogTrigger><DialogContent showCloseButton={false}><DialogHeader><DialogTitle>Theme dialog</DialogTitle><DialogDescription>Dialog description</DialogDescription></DialogHeader><DialogFooter><DialogClose>Done</DialogClose></DialogFooter></DialogContent></Dialog>
  </div></div>;
}
