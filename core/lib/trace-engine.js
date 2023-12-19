// @ts-expect-error missing types
import * as TraceEngine from '@paulirish/trace_engine';

import {polyfillDOMRect} from './polyfill-dom-rect.js';

polyfillDOMRect();

const TraceProcessor = TraceEngine.Processor.TraceProcessor;
const TraceHandlers = TraceEngine.Handlers.ModelHandlers;
const RootCauses = TraceEngine.RootCauses.RootCauses.RootCauses;

export {
  TraceProcessor,
  TraceHandlers,
  RootCauses,
};
