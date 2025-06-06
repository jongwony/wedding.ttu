import React, { useState } from "react";

type TabType = "photo" | "parking";

export default function InformationTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("photo");

  // 각 탭에 보여줄 내용 정의
  const tabContent = {
    photo: (
      <p className="mt-4 text-gray-600 text-lg">
        포토부스가 설치될 예정입니다.
        귀한 발걸음 해주신 여러분의 환한 미소와 따뜻한 말씀 남겨주시면
        소중히 간직하도록 하겠습니다.
      </p>
    ),
    parking: (
      <p className="mt-4 text-gray-600 text-lg">
        주차안내에 대한 내용이 들어갈 자리입니다.
        <br />
        (예: 주차장 위치, 주차 요금 등)
      </p>
    ),
  };

  return (
    <div className="mt-32 mb-32 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-pink-500">예식 안내</h2>

      {/* 탭 버튼 */}
      <div className="mt-4 flex justify-center space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("photo")}
          className={`pb-2 px-4 ${activeTab === "photo"
            ? "text-pink-600 border-b-2 border-pink-600"
            : "text-gray-500"
            }`}
        >
          포토부스
        </button>

        <button
          onClick={() => setActiveTab("parking")}
          className={`pb-2 px-4 font-medium ${activeTab === "parking"
            ? "text-pink-600 border-b-2 border-pink-600"
            : "text-gray-500"
            }`}
        >
          주차안내
        </button>
      </div>

      {/* 탭 내용 */}
      <div>{tabContent[activeTab]}</div>
    </div >
  );
}