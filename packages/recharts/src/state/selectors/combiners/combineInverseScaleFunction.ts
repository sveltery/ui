import { InverseScaleFunction } from '../../../hooks.js';
import { createCategoricalInverse } from '../../../util/scale/createCategoricalInverse.js';
import { CustomScaleDefinition } from '../../../util/scale/CustomScaleDefinition.js';

export function combineInverseScaleFunction(
  configuredScale: CustomScaleDefinition | undefined,
): InverseScaleFunction | undefined {
  if (configuredScale == null) {
    return undefined;
  }
  if ('invert' in configuredScale && typeof configuredScale.invert === 'function') {
    return configuredScale.invert.bind(configuredScale);
  }
  return createCategoricalInverse(configuredScale, undefined);
}
