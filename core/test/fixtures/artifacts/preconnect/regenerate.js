/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {startFlow} from '../../../../index.js';
import {updateTestFixture} from '../update-test-fixture.js';

/**
 * @param {import('puppeteer').Page} page
 * @param {number} port
 */
async function runUserFlow(page, port) {
  const flow = await startFlow(page, {
    flags: {
      networkQuietThresholdMs: 15000,
    },
  });

  await flow.navigate(`http://localhost:${port}/preconnect.html`);

  return flow;
}

/**
 * @param {LH.Artifacts} artifacts
 */
function verify(artifacts) {
  const originWithPreconnect = 'https://fonts.gstatic.com';

  const responseReceived = artifacts.DevtoolsLog.find(e =>
    e.method === 'Network.responseReceived' &&
    e.params.response.url.startsWith(originWithPreconnect));
  if (!responseReceived) throw new Error(`missing response for ${originWithPreconnect}`);

  console.log(responseReceived.params.response.timing);
  // Connection should have already been established, either b/c of the preconnect or the iframe.
  // TODO: why is this not working as expected?
  if (responseReceived.params.response.timing.connectStart !== -1) {
    throw new Error('expected connectStart to be -1');
  }
}

await updateTestFixture({
  name: 'preconnect',
  about: 'Page with a preconnect to another origin',
  saveTrace: true,
  saveDevtoolsLog: true,
  runUserFlow,
  verify,
});
