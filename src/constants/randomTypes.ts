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

import { RandomTypeOption } from '../types';

export const RANDOM_TYPES: RandomTypeOption[] = [
  { label: 'Surprise Me (Any)', value: 'ANY' },
  { label: 'Character/Creature', value: 'CHARACTER' },
  { label: 'Location/Setting', value: 'LOCATION' },
  { label: 'Object/Artifact', value: 'OBJECT' },
  { label: 'Weapon/Armor', value: 'WEAPON' },
  { label: 'Vehicle/Mech', value: 'VEHICLE' },
  { label: 'Food/Drink', value: 'FOOD' },
];
