/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/* eslint-disable no-undef */

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

const fakeWindow = {
  HTMLElement: class FakeHTMLElement {
    getAttribute() {
      return '';
    }

    getBoundingClientRect() {
      return {left: 42};
    }
  },
};

// @ts-expect-error
globalThis.window = fakeWindow;
globalThis.HTMLElement = globalThis.window.HTMLElement;
// @ts-expect-error
globalThis.ShadowRoot = class FakeShadowRoot {};
// @ts-expect-error
globalThis.Node = {DOCUMENT_FRAGMENT_NODE: 11};

function mainFn() {
  const el = Object.assign(new HTMLElement(), {
    tagName: 'FakeHTMLElement',
    innerText: 'contents',
    classList: [],
  });
  // @ts-expect-error
  return getNodeDetails(el);
}

// Indirect eval so code is run in global scope, and won't have incidental access to the
// esbuild keepNames function wrapper.
const indirectEval = eval;
const result = indirectEval(stringify(mainFn, [], [pageFunctions.getNodeDetails]));
if (result.lhId !== 'page-0-FakeHTMLElement' || result.boundingRect.left !== 42) {
  throw new Error(`unexpected result, got ${JSON.stringify(result, null, 2)}`);
}
