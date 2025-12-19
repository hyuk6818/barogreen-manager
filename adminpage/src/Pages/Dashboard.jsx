import React from "react";

// --- Component ---

export default function Dashboard() {
  return (
    <div className="dashboard-layout" style={{ padding: "12px 18px" }}>
      <div
        className="card"
        style={{
          padding: "64px 32px", // 패딩
          borderRadius: 16, // 모서리 둥글게
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)", // 그림자
          textAlign: "center", // 텍스트 중앙 정렬

          // --- [수정됨] 배경색 및 텍스트 스타일 ---

          // 배경 이미지를 제거하고, 밝은 연두색 배경으로 변경
          backgroundColor: "#f0fdf4", // Tailwind green-50

          // 텍스트 색상을 어두운 녹색으로 변경
          color: "#15803d", // Tailwind green-700

          minHeight: "400px", // 카드 최소 높이 지정
          display: "flex", // flex를 사용하여 내부 아이템 중앙 정렬
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* SVG 아이콘 크기를 64x64로 키움 */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            // [수정됨] 아이콘 색상 변경
            color: "#15803d",
            marginBottom: 20,
            // [수정됨] 아이콘 그림자 제거
            // filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="currentColor"
          />
          <path
            d="M12 17.5C14.33 17.5 16.3 15.84 17.17 13.5H6.83C7.7 15.84 9.67 17.5 12 17.5Z"
            fill="currentColor"
          />
          <circle cx="9" cy="10.5" r="1.5" fill="currentColor" />
          <circle cx="15" cy="10.5" r="1.5" fill="currentColor" />
        </svg>

        <h2
          style={{
            margin: 0,
            fontSize: 36, // 폰트 크기
            fontWeight: 800,
            // [수정됨] 텍스트 그림자 제거
            // textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          환영합니다, 관리자님.
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 20, // 폰트 크기
            // [수정됨] 텍스트 색상 변경
            color: "#16a34a", // Tailwind green-600
            // [수정됨] 텍스트 그림자 제거
            // textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          오늘도 좋은 하루 되세요!
        </p>
      </div>
    </div>
  );
}

// --- Sub-components & Styles ---
// 모두 제거됨
