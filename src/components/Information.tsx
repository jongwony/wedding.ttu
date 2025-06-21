import React, { useState } from "react";
import Kakaomap from "./KakaoMap";
import MapButtons from "./Navigation";

type TabType = "subway" | "bus" | "parking";

export default function InformationTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("subway");

  // 각 탭에 보여줄 내용 정의
  const tabContent = {
          subway: (
        <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🚊</div>
            <h3 className="text-xl font-semibold text-emerald-800">지하철</h3>
          </div>
          <div className="text-emerald-700">
            <p className="mb-2">🌿 2호선 건대입구역 2번 출구</p>
            <p>🌿 7호선 건대입구역 3번 출구</p>
            <p className="text-sm mt-3 text-emerald-600">출구 앞 건물 5층</p>
          </div>
        </div>
      ),
          bus: (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🚌</div>
            <h3 className="text-xl font-semibold text-indigo-800">버스</h3>
          </div>
        <div className="text-indigo-700 space-y-2 text-left">
          <p className="font-medium mb-3">건대입구역, 건대입구역 사거리 하차</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-2">간선</span>
              <span>240, 721, N61, N62번</span>
            </div>
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-2">지선</span>
              <span>2016, 2222, 3217, 3220, 4212번</span>
            </div>
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-2">직행</span>
              <span>102, 3500번</span>
            </div>
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-2">공항</span>
              <span>6013번</span>
            </div>
          </div>
        </div>
      </div>
    ),
    parking: (
      <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100">
        <div className="flex items-center mb-4">
          <div className="text-2xl mr-3">🅿️</div>
          <h3 className="text-xl font-semibold text-amber-800">주차 안내</h3>
        </div>
        <div className="text-amber-700 space-y-3">
          <p className="flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
            건물 내 주차장 이용 가능
          </p>
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            자세한 주차 요금 및 이용 시간은 예식장으로 문의해주세요.
          </p>
          <div className="flex items-center justify-center mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-amber-600 font-medium">예식장 문의</span>
            <a
              href="tel:02-430-8000"
              className="ml-3 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors duration-200 flex items-center"
            >
              📞 02-430-8000
            </a>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-pink-100 rounded-full mb-4">
          <div className="text-3xl">🌸</div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
          오시는 길
        </h2>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-pink-100">
          {[
            { key: "subway", label: "지하철", icon: "🚊" },
            { key: "bus", label: "버스", icon: "🚌" },
            { key: "parking", label: "주차안내", icon: "🅿️" }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${activeTab === key
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                : "text-gray-600 hover:text-pink-500 hover:bg-pink-50"
                }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="min-h-[200px]">
        {tabContent[activeTab]}
      </div>

      {/* 지도 섹션 */}
      <div className="mt-4">
        <Kakaomap />
        <MapButtons />
      </div>
    </div>
  );
}