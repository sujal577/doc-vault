import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import DocumentsPage from "./pages/DocumentsPage";
import PeoplePage from "./pages/PeoplePage";
import ComparePage from "./pages/ComparePage";
import AlertsPage from "./pages/AlertsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
