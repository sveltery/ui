// Supplemental input census derived from the byte-exact shadcn custom variants.
// These native attribute inputs are CSS environment probes, not component ports.
export const stateWitnesses = [
  { id: 'open-state', attrs: { 'data-state': 'open' }, width: 32 },
  { id: 'closed-state', attrs: { 'data-state': 'closed' }, width: 32 },
  { id: 'checked-state', attrs: { 'data-state': 'checked' }, width: 32 },
  { id: 'unchecked-state', attrs: { 'data-state': 'unchecked' }, width: 32 },
  { id: 'active-state', attrs: { 'data-state': 'active' }, width: 32 },
  ...['open', 'closed', 'checked', 'unchecked', 'disabled', 'active'].flatMap(name => [
    { id: `${name}-presence`, attrs: { [`data-${name}`]: '' }, width: 32 },
    { id: `${name}-true`, attrs: { [`data-${name}`]: 'true' }, width: 32 },
    { id: `${name}-false`, attrs: { [`data-${name}`]: 'false' }, width: 8 },
  ]),
  { id: 'selected-true', attrs: { 'data-selected': 'true' }, width: 32 },
  { id: 'selected-empty', attrs: { 'data-selected': '' }, width: 8 },
  { id: 'selected-false', attrs: { 'data-selected': 'false' }, width: 8 },
  { id: 'no-state', attrs: {}, width: 8 },
];
export const stateClasses = 'inline-block h-2 w-2 data-open:w-8 data-closed:w-8 data-checked:w-8 data-unchecked:w-8 data-disabled:w-8 data-active:w-8 data-selected:w-8';
