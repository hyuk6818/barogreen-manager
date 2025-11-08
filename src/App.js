import React from 'react';
// AdminDashboard 컴포넌트를 불러옵니다. (경로가 src/AdminDashboard.jsx라고 가정)
import AdminDashboard from './AdminDashboard'; 
// Tailwind CSS 스타일이 적용되도록 하려면, 
// Tailwind 설정 후 이 파일이나 index.js/index.jsx에서 전역 CSS를 import해야 합니다.
// 예: import './index.css';

function App() {
  return (
    // 프로젝트에 스타일이 적용되어 있다면, AdminDashboard의 디자인이 표시됩니다..
    <AdminDashboard />
  );
}

export default App;