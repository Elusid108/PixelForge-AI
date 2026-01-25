import { lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Workspace } from './components/layout/Workspace';
import { HistoryList } from './components/history/HistoryList';
import { StatusNotification } from './components/common/StatusNotification';
import { useAppStore } from './store/useAppStore';
import './styles/globals.css';

// Lazy load SettingsModal for code splitting
const SettingsModal = lazy(() =>
  import('./components/settings/SettingsModal').then((module) => ({
    default: module.SettingsModal,
  }))
);

function App() {
  const { processingStatus } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden relative">
      {processingStatus && <StatusNotification message={processingStatus} />}

      <Suspense fallback={null}>
        <SettingsModal />
      </Suspense>
      <HistoryList />

      <div className="flex-1 flex flex-col relative h-full">
        <Header />
        <Workspace />
      </div>
    </div>
  );
}

export default App;
