// Authored original-wrapper probe, separate from all seven immutable gallery bodies.
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from './avatar';
export function AvatarSupplementalProbe() {
  const root = React.useRef<HTMLSpanElement>(null);
  const [error, setError] = React.useState(false);
  const [trace, setTrace] = React.useState<{ status: string; rootDOMStatus: string | null }[]>([]);
  return <div data-hydrated="true"><section data-avatar-render-probe>
    <Avatar id="render-avatar-root" ref={root} render={(props, state) => <span {...props} data-root-status={state.imageLoadingStatus} />}>
      <AvatarImage id="render-avatar-image" src={`http://127.0.0.1:5173/avatar-${error ? 'error' : 'probe'}.png`} alt="Rendered actual portrait" render={<img />} onLoadingStatusChange={status => setTrace(previous => [...previous, { status, rootDOMStatus: root.current?.dataset.rootStatus ?? null }])} />
      <AvatarFallback id="render-avatar-fallback" render={<span />}>Rendered CN</AvatarFallback>
    </Avatar>
    <button onClick={() => setError(value => !value)}>Change rendered Avatar source</button>
    <output data-testid="avatar-callback-trace">{JSON.stringify(trace)}</output>
  </section><section data-avatar-mixed>
    <AvatarGroup><Avatar size="sm"><AvatarFallback>Small</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>Large</AvatarFallback></Avatar><AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
    <Avatar size="sm" data-size="lg"><AvatarFallback>Caller size</AvatarFallback></Avatar>
  </section></div>;
}
