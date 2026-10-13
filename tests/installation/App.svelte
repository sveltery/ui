<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '@sveltery/ui/alert';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/ui/avatar';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { ChartContainer } from '@sveltery/ui/chart';
  import { Dialog, DialogContent, DialogTrigger } from '@sveltery/ui/dialog';
  import { Empty, EmptyTitle } from '@sveltery/ui/empty';
  import { Kbd } from '@sveltery/ui/kbd';
  import { Label } from '@sveltery/ui/label';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/ui/message-scroller';
  import { Questionnaire, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireItem, QuestionnaireNext, QuestionnaireProgress, QuestionnaireSubmit, QuestionnaireTitle } from '@sveltery/ui/questionnaire';
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
<ChartContainer config={{ visits: { label: 'Visits', theme: { light: 'red', dark: 'blue' } } }}>Chart</ChartContainer>
<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent>Content</DialogContent></Dialog>
<Empty><EmptyTitle>Nothing</EmptyTitle></Empty>
<Kbd>K</Kbd>
<Label for="notes">Notes</Label>
<MessageScrollerProvider><MessageScroller><MessageScrollerViewport><MessageScrollerContent><MessageScrollerItem messageId="m1" scrollAnchor>Hello</MessageScrollerItem></MessageScrollerContent></MessageScrollerViewport><MessageScrollerButton /></MessageScroller></MessageScrollerProvider>
<Questionnaire items={[{ name: 'size', choices: [{ value: 'small' }, { value: 'large' }] }, { name: 'color' }]} shortcuts="letters">
  <QuestionnaireProgress />
  <QuestionnaireItem name="size"><QuestionnaireTitle>Size</QuestionnaireTitle><QuestionnaireChoices><QuestionnaireChoice value="small">Small</QuestionnaireChoice><QuestionnaireChoice value="large">Large</QuestionnaireChoice></QuestionnaireChoices></QuestionnaireItem>
  <QuestionnaireItem name="color"><QuestionnaireTitle>Color</QuestionnaireTitle></QuestionnaireItem>
  <QuestionnaireNext /><QuestionnaireSubmit />
</Questionnaire>
<ResizablePanelGroup><ResizablePanel defaultSize="30%">One</ResizablePanel><ResizableHandle withHandle /><ResizablePanel>Two</ResizablePanel></ResizablePanelGroup>
<Separator />
<Skeleton />
<Table><TableBody><TableRow><TableCell>Cell</TableCell></TableRow></TableBody></Table>
<Textarea id="notes" name="notes" value="Draft" />
