import { Action, autoBatchEnhancer, combineReducers, configureStore, Dispatch, Reducer, Store } from '@reduxjs/toolkit';
import { optionsReducer } from './optionsSlice.js';
import { tooltipReducer } from './tooltipSlice.js';
import { chartDataReducer } from './chartDataSlice.js';
import { chartLayoutReducer } from './layoutSlice.js';
import { mouseClickMiddleware, mouseMoveMiddleware } from './mouseEventsMiddleware.js';
import { reduxDevtoolsJsonStringifyReplacer } from './reduxDevtoolsJsonStringifyReplacer.js';
import { cartesianAxisReducer } from './cartesianAxisSlice.js';
import { graphicalItemsReducer } from './graphicalItemsSlice.js';
import { referenceElementsReducer } from './referenceElementsSlice.js';
import { brushReducer } from './brushSlice.js';
import { legendReducer } from './legendSlice.js';
import { rootPropsReducer } from './rootPropsSlice.js';
import { polarAxisReducer } from './polarAxisSlice.js';
import { polarOptionsReducer } from './polarOptionsSlice.js';
import { keyboardEventsMiddleware } from './keyboardEventsMiddleware.js';
import { externalEventsMiddleware } from './externalEventsMiddleware.js';
import { touchEventMiddleware } from './touchEventsMiddleware.js';
import { errorBarReducer } from './errorBarSlice.js';
import { Global } from '../util/Global.js';
import { zIndexReducer } from './zIndexSlice.js';
import { eventSettingsReducer } from './eventSettingsSlice.js';
import { renderedTicksReducer } from './renderedTicksSlice.js';

export type RechartsRootState = {
  brush: ReturnType<typeof brushReducer>;
  cartesianAxis: ReturnType<typeof cartesianAxisReducer>;
  chartData: ReturnType<typeof chartDataReducer>;
  errorBars: ReturnType<typeof errorBarReducer>;
  eventSettings: ReturnType<typeof eventSettingsReducer>;
  graphicalItems: ReturnType<typeof graphicalItemsReducer>;
  layout: ReturnType<typeof chartLayoutReducer>;
  legend: ReturnType<typeof legendReducer>;
  options: ReturnType<typeof optionsReducer>;
  polarAxis: ReturnType<typeof polarAxisReducer>;
  polarOptions: ReturnType<typeof polarOptionsReducer>;
  referenceElements: ReturnType<typeof referenceElementsReducer>;
  renderedTicks: ReturnType<typeof renderedTicksReducer>;
  rootProps: ReturnType<typeof rootPropsReducer>;
  tooltip: ReturnType<typeof tooltipReducer>;
  zIndex: ReturnType<typeof zIndexReducer>;
};

const rootReducer: Reducer<RechartsRootState> = combineReducers({
  brush: brushReducer,
  cartesianAxis: cartesianAxisReducer,
  chartData: chartDataReducer,
  errorBars: errorBarReducer,
  eventSettings: eventSettingsReducer,
  graphicalItems: graphicalItemsReducer,
  layout: chartLayoutReducer,
  legend: legendReducer,
  options: optionsReducer,
  polarAxis: polarAxisReducer,
  polarOptions: polarOptionsReducer,
  referenceElements: referenceElementsReducer,
  renderedTicks: renderedTicksReducer,
  rootProps: rootPropsReducer,
  tooltip: tooltipReducer,
  zIndex: zIndexReducer,
});

export const createRechartsStore = (
  preloadedState?: Partial<RechartsRootState>,
  chartName: string = 'Chart',
): Store<RechartsRootState> => {
  return configureStore<RechartsRootState>({
    reducer: rootReducer,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: preloadedState as any,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: !['commonjs', 'es6', 'production'].includes(process.env.NODE_ENV ?? ''),
      }).concat([
        mouseClickMiddleware.middleware,
        mouseMoveMiddleware.middleware,
        keyboardEventsMiddleware.middleware,
        externalEventsMiddleware.middleware,
        touchEventMiddleware.middleware,
      ]),
    /*
     * I can't find out how to satisfy typescript here.
     * We return `EnhancerArray<[StoreEnhancer<{}, {}>, StoreEnhancer]>` from this function,
     * but the types say we should return `EnhancerArray<StoreEnhancer<{}, {}>`.
     * Looks like it's badly inferred generics, but it won't allow me to provide the correct type manually either.
     * So let's just ignore the error for now.
     */
    // @ts-expect-error mismatched generics
    enhancers: getDefaultEnhancers => {
      let enhancers = getDefaultEnhancers;
      if (typeof getDefaultEnhancers === 'function') {
        /*
         * In RTK v2 this is always a function, but in v1 it is an array.
         * Because we have @types/redux-toolkit v1 as a dependency, typescript is going to flag this as an error.
         * We support both RTK v1 and v2, so we need to do this check.
         * https://redux-toolkit.js.org/usage/migrating-rtk-2#configurestoreenhancers-must-be-a-callback
         */
        // @ts-expect-error RTK v2 behaviour on RTK v1 types
        enhancers = getDefaultEnhancers();
      }
      return enhancers.concat(
        autoBatchEnhancer({
          type: 'raf',
        }),
      );
    },
    devTools: Global.devToolsEnabled && {
      serialize: {
        replacer: reduxDevtoolsJsonStringifyReplacer,
      },
      name: `recharts-${chartName}`,
    },
  });
};

export type AppDispatch = Dispatch<Action>;
