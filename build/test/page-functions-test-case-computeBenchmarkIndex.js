/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {ExecutionContext} from '../../core/gather/driver/execution-context.js';
import {pageFunctions} from '../../core/lib/page-functions.js';

/**
 *
 * @param {Function} mainFn
 * @param {any[]} args
 * @param {any[]} deps
 * @return {string}
 */
function stringify(mainFn, args, deps) {
  const argsSerialized = ExecutionContext.serializeArguments(args);
  const depsSerialized = ExecutionContext.serializeDeps(deps);
  const expression = `(() => {
    ${depsSerialized}
    return (${mainFn})(${argsSerialized});
  })()`;
  return expression;
}

// Indirect eval so code is run in global scope, and won't have incidental access to the
// esbuild keepNames function wrapper.
const indirectEval = eval;
const result = indirectEval(stringify(pageFunctions.computeBenchmarkIndex, [], []));
if (typeof result !== 'number') throw new Error(`expected number, but got ${result}`);
