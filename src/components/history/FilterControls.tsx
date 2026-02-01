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
import { SortDesc, SortAsc, Filter } from 'lucide-react';
import { STYLES } from '../../constants/styles';

interface FilterControlsProps {
  sortBy: 'newest' | 'oldest';
  setSortBy: (sort: 'newest' | 'oldest') => void;
  filterStyle: string;
  setFilterStyle: (style: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  sortBy,
  setSortBy,
  filterStyle,
  setFilterStyle,
}) => {
  return (
    <div className="p-3 border-b border-gray-800 grid grid-cols-2 gap-2 bg-gray-900/50">
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
          className="w-full bg-gray-950 border border-gray-800 text-gray-400 text-xs rounded-lg p-2 pl-8 appearance-none focus:border-purple-500 outline-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <div className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
          {sortBy === 'newest' ? <SortDesc size={12} /> : <SortAsc size={12} />}
        </div>
      </div>
      <div className="relative">
        <select
          value={filterStyle}
          onChange={(e) => setFilterStyle(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 text-gray-400 text-xs rounded-lg p-2 pl-8 appearance-none focus:border-purple-500 outline-none cursor-pointer"
        >
          <option value="ALL">All Styles</option>
          {STYLES.filter((s) => s.value).map((s, i) => (
            <option key={i} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
          <Filter size={12} />
        </div>
      </div>
    </div>
  );
};
