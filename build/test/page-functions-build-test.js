/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// Our page functions are very sensitive to mangling performed by bundlers. Incorrect
// bundling will certainly result in `yarn test-bundle` or `yarn smoke --runner devtools` failing.
// The bundled lighthouse is a huge beast and hard to debug, so instead we have these smaller bundles
// which are much easier to reason about.

import path from 'path';
import {execFileSync} from 'child_process';

import {LH_ROOT} from '../../root.js';
import {buildBundle} from '../build-bundle.js';

describe('page functions build', () => {
  const testCases = [
    `${LH_ROOT}/build/test/page-functions-test-case-computeBenchmarkIndex.js`,
    `${LH_ROOT}/build/test/page-functions-test-case-getNodeDetails.js`,
    `${LH_ROOT}/build/test/page-functions-test-case-getElementsInDocument.js`,
  ];

  for (const minify of [false, true]) {
    describe(`minify: ${minify}`, () => {
      for (const input of testCases) {
        it(`bundle and evaluate ${path.basename(input)}`, async () => {
          const output = minify ?
            input.replace('.js', '-out.min.js') :
            input.replace('.js', '-out.js');
          await buildBundle(input, output, {minify});
          execFileSync('node', [output]);
        });
      }
    });
  }
});
