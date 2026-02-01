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

import { MoodOption } from '../types';

export const MOODS: MoodOption[] = [
  { label: 'Default', value: '' },
  { label: 'Vibrant', value: ', vibrant colors, high saturation' },
  { label: 'Muted', value: ', muted colors, desaturated, matte' },
  { label: 'Pastel', value: ', pastel color palette, soft colors' },
  { label: 'Dark Fantasy', value: ', dark fantasy, grim, ethereal' },
  { label: 'Ethereal', value: ', ethereal, dreamy, magical' },
  { label: 'Retro', value: ', retro aesthetic, vintage filter' },
  { label: 'B&W', value: ', black and white, monochrome' },
];
