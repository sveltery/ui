<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '@sveltery/ui/alert';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/ui/avatar';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Dialog, DialogContent, DialogTrigger } from '@sveltery/ui/dialog';
  import { Empty, EmptyTitle } from '@sveltery/ui/empty';
  import { Kbd } from '@sveltery/ui/kbd';
  import { Label } from '@sveltery/ui/label';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@sveltery/ui/resizable';
  import { Separator } from '@sveltery/ui/separator';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Table, TableBody, TableCell, TableRow } from '@sveltery/ui/table';
  import { Textarea } from '@sveltery/ui/textarea';
</script>
<Alert><AlertTitle>Title</AlertTitle><AlertDescription>Description</AlertDescription><AlertAction>Action</AlertAction></Alert>
<AspectRatio ratio={2}>Ratio</AspectRatio>
<Avatar><AvatarImage src="/a.png" alt="" /><AvatarFallback>CN</AvatarFallback></Avatar>
<Button>Save</Button>
<Card><CardHeader><CardTitle>Card</CardTitle></CardHeader><CardContent>Body</CardContent></Card>
<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent>Content</DialogContent></Dialog>
<Empty><EmptyTitle>Nothing</EmptyTitle></Empty>
<Kbd>K</Kbd>
<Label for="notes">Notes</Label>
<ResizablePanelGroup><ResizablePanel defaultSize="30%">One</ResizablePanel><ResizableHandle withHandle /><ResizablePanel>Two</ResizablePanel></ResizablePanelGroup>
<Separator />
<Skeleton />
<Table><TableBody><TableRow><TableCell>Cell</TableCell></TableRow></TableBody></Table>
<Textarea id="notes" name="notes" value="Draft" />
