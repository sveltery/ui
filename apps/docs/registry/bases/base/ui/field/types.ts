import type { FieldRootProps } from '@sveltery/base/field';
import type { FieldHandle } from '@sveltery/base/form';
import type { FieldVariants } from './variants.js';
export type FieldProps<F extends FieldHandle = FieldHandle> = FieldRootProps<F> & FieldVariants;
