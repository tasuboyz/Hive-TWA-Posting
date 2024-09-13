import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PostingPage from './page/PostPage';
import { Telegram } from "@twa-dev/types";
import CommunityPage from './page/CommunityPage';
import './App.css'

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const basePath = "/Hive-TWA-Posting";
//const basePath = "/TWA-TEST";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={`${basePath}/`} element={<PostingPage />} />
        <Route path={`${basePath}/post`} element={<PostingPage />} />
        <Route path={`${basePath}/community-page`} element={<CommunityPage />} />
        <Route path="*" element={<Navigate to={`${basePath}/`} />} />
      </Routes>
    </Router>
  );
};

export default App;
