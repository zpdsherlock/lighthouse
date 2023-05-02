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
  const flow = await startFlow(page);

  await flow.navigate(`http://localhost:${port}/video-embed.html`);

  return flow;
}

/**
 * @param {LH.Artifacts} artifacts
 */
function verify(artifacts) {
  const {traceEvents} = artifacts.Trace;

  if (!traceEvents.find(e =>
    e.name === 'navigationStart' && e.args.data?.documentLoaderURL?.includes('youtube.com'))) {
    throw new Error('missing video embed');
  }
  if (!traceEvents.find(e =>
    e.name === 'navigationStart' && e.args.data?.documentLoaderURL?.includes('vimeo.com'))) {
    throw new Error('missing video embed');
  }
}

await updateTestFixture({
  name: 'video-embed',
  about: 'Page with a YouTube and Vimeo video',
  saveTrace: true,
  saveDevtoolsLog: true,
  runUserFlow,
  verify,
});
