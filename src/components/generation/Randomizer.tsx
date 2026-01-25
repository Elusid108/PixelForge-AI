import React from 'react';
import { ChevronDown, CheckSquare, Type, Palette, Sparkles } from 'lucide-react';
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
    <div className="relative flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800 w-full">
      {/* Custom Category Dropdown */}
      <div className="relative flex-1 min-w-0">
        <button
          onClick={() => setIsRandomizerOpen(!isRandomizerOpen)}
          className="w-full flex items-center justify-between gap-2 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors focus:outline-none"
          title="Select Randomizer Category"
        >
          <span className="font-medium truncate">
            {randomTypes.find((t) => t.value === randomType)?.label}
          </span>
          <ChevronDown size={12} className="flex-shrink-0" />
        </button>

        {/* Dropdown Menu Overlay */}
        {isRandomizerOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsRandomizerOpen(false)}
            ></div>
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
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

      {/* Three Randomization Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => randomize('prompt-only')}
          disabled={isRandomizing}
          className="p-1.5 bg-gray-800 hover:bg-blue-600 text-blue-400 hover:text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-700 hover:border-blue-500 group relative"
          title="Random Prompt Only (keeps style/lighting/mood)"
        >
          {isRandomizing ? (
            <div className="loader w-3.5 h-3.5 border-2 border-current"></div>
          ) : (
            <Type size={14} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={() => randomize('style-only')}
          disabled={isRandomizing}
          className="p-1.5 bg-gray-800 hover:bg-purple-600 text-purple-400 hover:text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-700 hover:border-purple-500 group relative"
          title="Random Style Only (keeps prompt)"
        >
          {isRandomizing ? (
            <div className="loader w-3.5 h-3.5 border-2 border-current"></div>
          ) : (
            <Palette size={14} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={() => randomize('everything')}
          disabled={isRandomizing}
          className="p-1.5 bg-gray-800 hover:bg-green-600 text-green-400 hover:text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-700 hover:border-green-500 group relative"
          title="Random Everything"
        >
          {isRandomizing ? (
            <div className="loader w-3.5 h-3.5 border-2 border-current"></div>
          ) : (
            <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};
