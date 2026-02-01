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

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, title, className = '' }) => {
  return (
    <input
      type="checkbox"
      className={`custom-checkbox ${className}`}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      title={title}
    />
  );
};
