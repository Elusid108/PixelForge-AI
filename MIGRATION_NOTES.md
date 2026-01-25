# Migration Notes

## What Changed

The application has been restructured from a single HTML file into a modern, scalable React application with TypeScript.

### Before
- Single `index.html` file (~1038 lines)
- All code inline with CDN dependencies
- No build process
- No type safety
- Difficult to maintain and test

### After
- Modular project structure with ~40+ files
- Vite build system with TypeScript
- Separated concerns (components, services, hooks, store)
- Full type safety
- Performance optimizations (code splitting, lazy loading, React.memo)
- Easy to test and maintain

## Key Improvements

1. **Build System**: Vite for fast development and optimized builds
2. **Type Safety**: Full TypeScript coverage
3. **State Management**: Zustand for global state
4. **Component Architecture**: Separated into layout, feature, and common components
5. **Service Layer**: API calls and storage isolated
6. **Custom Hooks**: Business logic extracted into reusable hooks
7. **Performance**: Code splitting, lazy loading, memoization
8. **Developer Experience**: ESLint, Prettier, proper project structure

## File Mapping

### Constants
- `RANDOM_TYPES` → `src/constants/randomTypes.ts`
- `STYLES` → `src/constants/styles.ts`
- `RATIOS` → `src/constants/ratios.ts`
- `LIGHTING` → `src/constants/lighting.ts`
- `MOODS` → `src/constants/moods.ts`

### Services
- `callTextAI`, `generateRandomPrompt`, `generateFilename` → `src/services/api/gemini.ts`
- `callImagen` → `src/services/api/imagen.ts`
- IndexedDB functions → `src/services/storage/indexedDB.ts`
- localStorage functions → `src/services/storage/localStorage.ts`
- ZIP functionality → `src/services/download/zipService.ts`

### Components
- Main `App` component → Split into:
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Workspace.tsx`
  - `src/components/history/HistoryList.tsx`
  - `src/components/generation/PromptInput.tsx`
  - `src/components/generation/Randomizer.tsx`
  - `src/components/generation/GenerationControls.tsx`
  - `src/components/generation/ImagePreview.tsx`
  - `src/components/settings/SettingsModal.tsx`
  - `src/components/common/*` (reusable components)

### State Management
- All state moved to `src/store/useAppStore.ts` (Zustand)
- Custom hooks in `src/hooks/` for complex logic

## Running the New Version

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## Breaking Changes

None - the functionality remains the same, only the structure changed. The old `index.html` can be kept as a backup but is no longer used.

## Next Steps (Optional)

1. Add unit tests for components and services
2. Add E2E tests with Playwright or Cypress
3. Add error boundaries for better error handling
4. Consider adding a backend for cloud storage/sharing features
5. Add analytics for usage tracking
6. Improve accessibility (ARIA labels, keyboard navigation)
