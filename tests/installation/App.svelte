<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '@sveltery/components/alert';
  import { AspectRatio } from '@sveltery/components/aspect-ratio';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/components/avatar';
  import { Button } from '@sveltery/components/button';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@sveltery/components/carousel';
  import { Card, CardContent, CardHeader, CardTitle } from '@sveltery/components/card';
  import { ChartContainer } from '@sveltery/components/chart';
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@sveltery/components/command';
  import { Dialog, DialogContent, DialogTrigger } from '@sveltery/components/dialog';
  import { Empty, EmptyTitle } from '@sveltery/components/empty';
  import { Kbd } from '@sveltery/components/kbd';
  import { Label } from '@sveltery/components/label';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import { Questionnaire, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireItem, QuestionnaireNext, QuestionnaireProgress, QuestionnaireSubmit, QuestionnaireTitle } from '@sveltery/components/questionnaire';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@sveltery/components/resizable';
  import { Separator } from '@sveltery/components/separator';
  import { Skeleton } from '@sveltery/components/skeleton';
  import { Table, TableBody, TableCell, TableRow } from '@sveltery/components/table';
  import { Textarea } from '@sveltery/components/textarea';
</script>
<Alert><AlertTitle>Title</AlertTitle><AlertDescription>Description</AlertDescription><AlertAction>Action</AlertAction></Alert>
<AspectRatio ratio={2}>Ratio</AspectRatio>
<Avatar><AvatarImage src="/a.png" alt="" /><AvatarFallback>CN</AvatarFallback></Avatar>
<Button>Save</Button>
<Card><CardHeader><CardTitle>Card</CardTitle></CardHeader><CardContent>Body</CardContent></Card>
<ChartContainer config={{ visits: { label: 'Visits', theme: { light: 'red', dark: 'blue' } } }}>Chart</ChartContainer>
<Carousel><CarouselContent><CarouselItem>Slide</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
<Command><CommandInput placeholder="Search" /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem>Calendar</CommandItem><CommandItem value="calc">Calculator</CommandItem></CommandGroup></CommandList></Command>
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
