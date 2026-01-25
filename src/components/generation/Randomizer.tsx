import React from 'react';
import { ChevronDown, CheckSquare, Dices } from 'lucide-react';
import { useRandomizer } from '../../hooks/useRandomizer';

export const Randomizer: React.FC = () => {
  const {
    isRandomizing,
    randomType,
    setRandomType,
    isRandomizerOpen,
    setIsRandomizerOpen,
    randomize,
    randomTypes,
  } = useRandomizer();

  return (
    <div className="relative flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
      {/* Custom Category Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsRandomizerOpen(!isRandomizerOpen)}
          className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors focus:outline-none"
          title="Select Randomizer Category"
        >
          <span className="font-medium">
            {randomTypes.find((t) => t.value === randomType)?.label}
          </span>
          <ChevronDown size={12} />
        </button>

        {/* Dropdown Menu Overlay */}
        {isRandomizerOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsRandomizerOpen(false)}
            ></div>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
              {randomTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setRandomType(t.value);
                    setIsRandomizerOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex items-center justify-between ${
                    randomType === t.value ? 'text-purple-400 bg-gray-800/50' : 'text-gray-300'
                  }`}
                >
                  <span>{t.label}</span>
                  {randomType === t.value && <CheckSquare size={10} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-700 mx-1"></div>

      {/* Dice Button */}
      <button
        onClick={randomize}
        disabled={isRandomizing}
        className="p-1.5 bg-gray-800 hover:bg-blue-600 text-blue-400 hover:text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-700 hover:border-blue-500 group"
        title="Roll the Dice"
      >
        {isRandomizing ? (
          <div className="loader w-3.5 h-3.5 border-2 border-current"></div>
        ) : (
          <Dices size={16} className="group-hover:rotate-180 transition-transform duration-500" />
        )}
      </button>
    </div>
  );
};
