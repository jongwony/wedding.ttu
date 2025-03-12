"use client"
import React, { useEffect, useRef } from "react";

// 전역 스코프에 kakao 타입이 없으므로 타입을 선언해줍니다.
declare global {
  interface Window {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const Kakaomap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // 스크립트를 로드하고 kakao.maps를 초기화합니다.
  useEffect(() => {
    // kakao.maps가 이미 로드된 경우 (CSR 재렌더링 등) 중복 로드를 막기 위한 체크
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=df5f469db561d2fa14f32356239d9ec1&libraries=services";
      script.onload = () => {
        window.kakao.maps.load(() => {
          initMap();
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  // 지도 초기화
  const initMap = () => {
    if (!mapRef.current) return;

    // 스타시티 아트홀 위치(홈)
    const coords = new window.kakao.maps.LatLng(
      37.5407309,
      127.0714632,
    );
    const mapOption = {
      center: coords,
      level: 3, // 확대 레벨
    };

    // 지도 객체 생성
    const mapInstance = new window.kakao.maps.Map(mapRef.current, mapOption);

    // 마커 생성
    const markerInstance = new window.kakao.maps.Marker({
      position: coords,
    });
    markerInstance.setMap(mapInstance);

    // 인포윈도우 생성
    const infoWindowInstance = new window.kakao.maps.InfoWindow({ zindex: 1 });
    const infoContent = `
      <div style="color:#333333;padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
        <p style="background-color:#DDDDDD;font-weight: bold;font-size: 14px;">스타시티 아트홀</p>
        <small style="display: block;margin-top: 5px;">서울시 광진구 화양동 능동로 110</small>
      </div>
    `;
    infoWindowInstance.setContent(infoContent);
    infoWindowInstance.open(mapInstance, markerInstance);

    // 필요 시 RoadView 로직 등 추가
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="mt-24 text-3xl font-bold">오시는 길</h2>
      <p className="text-gray-400 m-4">
        건대입구 역 3번 출구
      </p>

      <div className="mt-8 flex justify-center">
        <div
          id="map"
          className="w-full max-w-md h-96 border rounded-md"
          ref={mapRef}
        />
      </div>
    </div>
  );
};

export default Kakaomap;