import { AnimationManager, createAnimateManager } from './AnimationManager.js';
import { RequestAnimationFrameTimeoutController } from './timeoutController.js';

export function createDefaultAnimationManager(): AnimationManager {
  return createAnimateManager(new RequestAnimationFrameTimeoutController());
}
