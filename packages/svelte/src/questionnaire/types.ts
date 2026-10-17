import type { Snippet } from 'svelte';
import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFieldsetAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes
} from 'svelte/elements';

export type QuestionnaireItemStatus = 'unanswered' | 'answered' | 'skipped';
export type QuestionnaireShortcutMode = 'letters' | 'numbers';

export interface QuestionnaireChoiceDefinition {
  value: string;
  disabled?: boolean;
}

export interface QuestionnaireItemDefinition {
  name: string;
  required?: boolean;
  disabled?: boolean;
  choices?: readonly QuestionnaireChoiceDefinition[];
}

export type QuestionnaireInputType =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

/** Undefined when a render snippet should show its own content. */
type RenderChildren = Snippet | undefined;
type Render<Props, State> = Snippet<[props: Props, state: State, children: RenderChildren]>;
type NoState = Record<string, never>;

export interface QuestionnaireRootState {
  current: number;
  first: boolean;
  last: boolean;
  total: number;
}

export interface QuestionnaireRootProps extends Omit<HTMLFormAttributes, 'children' | 'novalidate'> {
  /** The active item name. Bind it to follow and set navigation. */
  item?: string;
  /** The item to start on when `item` is undefined. Defaults to the first enabled item. */
  defaultItem?: string;
  /** Item order, required flags and choice values, so the server renders the active item, progress and shortcuts. */
  items?: readonly QuestionnaireItemDefinition[];
  /** Called when navigation moves to another item. */
  onItemChange?: (item: string) => void;
  shortcuts?: QuestionnaireShortcutMode;
  /** Turns off the browser's constraint validation UI. Questionnaire validation still runs. @default true */
  novalidate?: boolean;
  children?: Snippet;
}

export type QuestionnaireProgressState = QuestionnaireRootState;

export interface QuestionnaireProgressProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, QuestionnaireProgressState>;
  /** Defaults to "Question {current} of {total}". */
  children?: Snippet;
}

export interface QuestionnaireItemState {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
  multiple: boolean;
  required: boolean;
  status: QuestionnaireItemStatus;
}

export interface QuestionnaireItemProps extends Omit<HTMLFieldsetAttributes, 'children' | 'name' | 'disabled'> {
  /** Unique within the questionnaire, and the form field name of its answers. */
  name: string;
  required?: boolean;
  /** Renders fixed choices as checkboxes. */
  multiple?: boolean;
  /** Removes the item from progress, navigation, validation and submission. */
  disabled?: boolean;
  /** Marks the item invalid from an external validator. */
  invalid?: boolean;
  onStatusChange?: (status: QuestionnaireItemStatus) => void;
  children?: Snippet;
}

export interface QuestionnaireTitleProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Replaces the `<legend>`. Give it an `id` and pass that to the Item's `aria-labelledby`. */
  render?: Render<HTMLAttributes<HTMLElement>, NoState>;
  children?: Snippet;
}

export interface QuestionnaireDescriptionProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, NoState>;
  children?: Snippet;
}

export interface QuestionnaireChoicesState {
  shortcuts: QuestionnaireShortcutMode | null;
}

export interface QuestionnaireChoicesProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, QuestionnaireChoicesState>;
  children?: Snippet;
}

export interface QuestionnaireChoiceState {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  shortcut: string | null;
  type: 'checkbox' | 'radio';
}

export interface QuestionnaireChoiceProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onchange'> {
  value: string;
  /** Bind it to follow and set the selection. */
  checked?: boolean;
  /** The state a form reset restores. Defaults to the initial `checked`. */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Runs for the native input's change event. */
  onchange?: HTMLInputAttributes['onchange'];
  render?: Render<HTMLAttributes<HTMLElement>, QuestionnaireChoiceState>;
  children?: Snippet;
}

export interface QuestionnaireChoiceInputProps
  extends Omit<HTMLInputAttributes, 'checked' | 'defaultChecked' | 'disabled' | 'name' | 'required' | 'type' | 'value' | 'children'> {
  render?: Snippet<[props: HTMLInputAttributes, state: QuestionnaireChoiceState]>;
}

export interface QuestionnaireChoiceLabelProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, NoState>;
  children?: Snippet;
}

export interface QuestionnaireChoiceShortcutState {
  shortcut: string | null;
}

export interface QuestionnaireChoiceShortcutProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, QuestionnaireChoiceShortcutState>;
  /** Defaults to the assigned shortcut. */
  children?: Snippet;
}

export interface QuestionnaireInputState {
  disabled: boolean;
  filled: boolean;
  invalid: boolean;
}

export interface QuestionnaireInputProps
  extends Omit<HTMLInputAttributes, 'form' | 'name' | 'type' | 'value' | 'defaultValue' | 'disabled' | 'children'> {
  type?: QuestionnaireInputType;
  /** Bind it to follow and set the text. A number input holds a number, or null when empty. */
  value?: string | number | null;
  /** The value a form reset restores. Defaults to the initial `value`. */
  defaultValue?: string | number | null;
  disabled?: boolean;
  render?: Snippet<[props: HTMLInputAttributes, state: QuestionnaireInputState]>;
}

export interface QuestionnaireErrorState {
  invalid: boolean;
}

export interface QuestionnaireErrorProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  render?: Render<HTMLAttributes<HTMLElement>, QuestionnaireErrorState>;
  /** Defaults to a message that depends on whether the item is required. */
  children?: Snippet;
}

export interface QuestionnaireNavigationState {
  disabled: boolean;
  shortcut: 'Enter' | null;
  status: QuestionnaireItemStatus | null;
  visible: boolean;
}

export interface QuestionnaireNavigationProps extends Omit<HTMLButtonAttributes, 'children'> {
  render?: Render<HTMLButtonAttributes, QuestionnaireNavigationState>;
  /** Defaults to the action's name, such as "Next". */
  children?: Snippet;
}

export type QuestionnairePreviousProps = QuestionnaireNavigationProps;
export type QuestionnaireSkipProps = QuestionnaireNavigationProps;
export type QuestionnaireNextProps = QuestionnaireNavigationProps;
export type QuestionnaireSubmitProps = QuestionnaireNavigationProps;
