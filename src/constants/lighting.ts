/*
 * Copyright 2026 Christopher Moore
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LightingOption } from '../types';

export const LIGHTING: LightingOption[] = [
  { label: 'Default', value: '' },
  { label: 'Cinematic', value: ', cinematic lighting, dramatic shadows' },
  { label: 'Natural', value: ', soft natural lighting, sunlight' },
  { label: 'Golden Hour', value: ', golden hour, warm sunset lighting' },
  { label: 'Studio', value: ', studio lighting, perfect exposure' },
  { label: 'Neon', value: ', neon lighting, glowing, vibrant' },
  { label: 'Dark/Moody', value: ', dark atmosphere, dim lighting, mystery' },
  { label: 'Rembrandt', value: ', rembrandt lighting, chiaroscuro' },
];
