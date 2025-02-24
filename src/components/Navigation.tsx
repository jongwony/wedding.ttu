import React from 'react';
import Link from 'next/link';

const MapButtons: React.FC = () => {
  // 예시로 설정한 위도, 경도, 장소명
  const lat = 37.5407309;
  const lng = 127.0714632;
  const placeName = '스타시티아트홀';

  // 네이버 지도 링크 (주어진 예시 그대로 사용)
  const naverLink = `https://nmap.place.naver.com/launchApp/route?path=route&type=place&dlat=${lat}&dlng=${lng}&did=13541226&dname=${encodeURIComponent(placeName)}`;

  // 카카오내비 링크 (x: 경도, y: 위도)
  const kakaoNaviLink = `kakaonavi://navigate?name=${encodeURIComponent(placeName)}&x=${lng}&y=${lat}&coord_type=wgs84`;

  // 티맵 딥링크 (goalx: 경도, goaly: 위도)
  const tmapLink = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(placeName)}`;

  return (
    <div className="flex mt-4 space-x-2 justify-center">
      {/* 네이버 지도 버튼 */}
      <Link
        href={naverLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-4 py-2 rounded-md text-white font-semibold"
        style={{ backgroundColor: '#03C75A' }} // 네이버 컬러
      >
        네이버 지도
      </Link>

      {/* 카카오 내비 버튼 */}
      <Link
        href={kakaoNaviLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-4 py-2 rounded-md font-semibold"
        style={{ backgroundColor: '#FFE812', color: '#000000' }} // 카카오 컬러
      >
        카카오 내비
      </Link>

      {/* 티맵 버튼 */}
      <Link
        href={tmapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-4 py-2 rounded-md text-white font-semibold"
        style={{ backgroundColor: '#6200EE' }} // 티맵 컬러(예시)
      >
        티맵
      </Link>
    </div>
  );
};

export default MapButtons;