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
