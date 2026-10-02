// Supplemental source-derived witness; actual pinned scaffold import executes without replacement.
import { Example, ExampleWrapper } from './example-scaffold';
export function ExampleProbe() {
  return <ExampleWrapper id="probe-wrapper" data-probe="wrapper" data-slot="custom-wrapper">
    <Example id="probe-example" data-slot="custom-example" title="Example & <draft>" className="gap-2 p-4" containerClassName="max-w-md" style={{ color: 'rgb(1, 2, 3)' }}>
      <div data-testid="unclassed-child">Plain child</div><div className="w-24" data-testid="sized-child">Sized child</div><span>Inline child</span>
    </Example>
    <Example id="empty-title" title=""><div>Empty title</div></Example>
    <Example id="absent-title"><div>Absent title</div></Example>
  </ExampleWrapper>;
}
