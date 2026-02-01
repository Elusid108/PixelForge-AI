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

import { lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Workspace } from './components/layout/Workspace';
import { HistoryList } from './components/history/HistoryList';
import { StatusNotification } from './components/common/StatusNotification';
import { Toast } from './components/common/Toast';
import { useAppStore } from './store/useAppStore';
import './styles/globals.css';

// Lazy load SettingsModal for code splitting
const SettingsModal = lazy(() =>
  import('./components/settings/SettingsModal').then((module) => ({
    default: module.SettingsModal,
  }))
);

// Lazy load ShortcutsModal for code splitting
const ShortcutsModal = lazy(() =>
  import('./components/common/ShortcutsModal').then((module) => ({
    default: module.ShortcutsModal,
  }))
);

// Lazy load ImageDetailsModal for code splitting
const ImageDetailsModal = lazy(() =>
  import('./components/history/ImageDetailsModal').then((module) => ({
    default: module.ImageDetailsModal,
  }))
);

// ConfirmationModal is not lazy loaded since it's used frequently
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PromptTemplates } from './components/generation/PromptTemplates';

function App() {
  const { processingStatus } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden relative">
      {processingStatus && <StatusNotification message={processingStatus} />}
      <Toast />

      <ConfirmationModal />
      <PromptTemplates />
      <Suspense fallback={null}>
        <SettingsModal />
        <ShortcutsModal />
        <ImageDetailsModal />
      </Suspense>
      <ErrorBoundary>
        <HistoryList />
      </ErrorBoundary>

      <div className="flex-1 flex flex-col relative h-full">
        <Header />
        <Workspace />
      </div>
    </div>
  );
}

export default App;
