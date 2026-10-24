import type { ComponentProps } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
import type { ButtonVariants } from '../button/index.js';

type NavigationProps = Pick<ButtonVariants, 'size' | 'variant'>;

export type QuestionnaireProps = ComponentProps<typeof Primitive.Root>;
export type QuestionnaireProgressProps = ComponentProps<typeof Primitive.Progress>;
export type QuestionnaireItemProps = ComponentProps<typeof Primitive.Item>;
export type QuestionnaireTitleProps = ComponentProps<typeof Primitive.Title>;
export type QuestionnaireDescriptionProps = ComponentProps<typeof Primitive.Description>;
export type QuestionnaireChoicesProps = ComponentProps<typeof Primitive.Choices>;
export type QuestionnaireChoiceProps = ComponentProps<typeof Primitive.Choice>;
export type QuestionnaireChoiceDescriptionProps = HTMLAttributes<HTMLSpanElement>;
export type QuestionnaireInputProps = ComponentProps<typeof Primitive.Input>;
export type QuestionnaireErrorProps = ComponentProps<typeof Primitive.Error>;
export type QuestionnaireActionsProps = HTMLAttributes<HTMLDivElement>;
export type QuestionnairePreviousProps = ComponentProps<typeof Primitive.Previous> & NavigationProps;
export type QuestionnaireSkipProps = ComponentProps<typeof Primitive.Skip> & NavigationProps;
export type QuestionnaireNextProps = ComponentProps<typeof Primitive.Next> & NavigationProps;
export type QuestionnaireSubmitProps = ComponentProps<typeof Primitive.Submit> & NavigationProps;
export type {
  QuestionnaireChoiceDefinition,
  QuestionnaireInputType,
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireShortcutMode,
} from '@sveltery/base/questionnaire';
