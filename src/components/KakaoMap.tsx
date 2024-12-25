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

  // Vue의 mounted() 훅에 해당하는 부분: 스크립트를 로드하고 kakao.maps를 초기화합니다.
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

  // Vue의 methods에 해당: 지도 초기화
  const initMap = () => {
    if (!mapRef.current) return;

    // 송파구 삼전동 위치(홈)
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

    infoWindowInstance.setContent(
      `<div style="color: #333333;padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
        서울시 광진구 화양동 능동로 110 <br> 스타시티 아트홀
      </div>`
    );
    infoWindowInstance.open(mapInstance, markerInstance);

    // 필요 시 RoadView 로직 등 추가

  };

  return (
    <div
      id="map"
      className="w-full max-w-md h-96 border rounded-lg shadow-lg"
      ref={mapRef}
    />
  );
};

export default Kakaomap;