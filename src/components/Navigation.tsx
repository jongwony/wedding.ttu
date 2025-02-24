import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 서버 사이드 렌더링 환경에서도 에러가 발생하지 않도록 체크
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor;
      // 더 많은 모바일 디바이스를 커버하는 정규식
      const mobileRegex = /android|avantgo|blackberry|iemobile|ipad|iphone|ipod|opera mini|palm|windows phone/i;
      setIsMobile(mobileRegex.test(userAgent));
    }
  }, []);

  return isMobile;
};

const MapButtons: React.FC = () => {
  // 모바일 여부 state 사용
  const isMobile = useIsMobile();

  // 예시로 설정한 위도, 경도, 장소명
  const lat = 37.5407309;
  const lng = 127.0714632;
  const placeName = '스타시티아트홀';

  // 네이버 길찾기 링크
  const naverLink = `https://nmap.place.naver.com/launchApp/route?path=route&type=place&dlat=${lat}&dlng=${lng}&did=13541226&dname=${encodeURIComponent(placeName)}`;

  // 카카오 길찾기 링크
  const kakaoLink = `https://m.map.kakao.com/actions/routeView?exEnc=MNSRST&eyEnc=QNLORMV&endLoc=${placeName}&ids=%2CP12976773`

  // 네이버 지도 딥링크
  const navermapLink = `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(placeName)}`;

  // 카카오맵 딥링크
  const kakaomapLink = `kakaomap://route?name=${encodeURIComponent(placeName)}&ep=${lat},${lng}`;

  // 티맵 딥링크 (goalx: 경도, goaly: 위도)
  const tmapLink = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(placeName)}`;

  return (
    <div className="flex mt-4 space-x-2 justify-center text-sm font-semibold">
      {isMobile ? (
        <>
          {/* 네이버 지도 버튼 */}
          <Link
            href={navermapLink}
            className="flex items-center px-4 py-2 rounded-md text-white hover:bg-opacity-80 transition-colors duration-300"
            style={{ backgroundColor: '#03C75A' }} // 네이버 컬러
          >
            <Image
              src="/images/logo/navermap.png"
              alt="네이버 지도 로고"
              width={24}
              height={24}
              className="h-[1em] w-auto align-middle"
            />
            <span className="ml-2">네이버 지도</span>
          </Link>

          {/* 카카오 버튼 */}
          <Link
            href={kakaomapLink}
            className="flex items-center px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors duration-300"
            style={{ backgroundColor: '#FFE812', color: '#000000' }} // 카카오 컬러
          >
            <Image
              src="/images/logo/kakaomap.png"
              alt="카카오맵 로고"
              width={24}
              height={24}
              className="h-[1em] w-auto align-middle"
            />
            <span className="ml-2">카카오맵</span>
          </Link>

          {/* 티맵 버튼 */}
          <Link
            href={tmapLink}
            className="flex items-center px-4 py-2 rounded-md text-white bg-purple-800 hover:bg-opacity-80 transition-colors duration-300"
          >
            <Image
              src="/images/logo/tmap.png"
              alt="티맵 로고"
              width={24}
              height={24}
              className="h-[1em] w-auto align-middle"
            />
            <span className="ml-2">티맵</span>
          </Link>
        </>
      ) : (
        <>
          {/* 네이버 길찾기 버튼 */}
          <Link
            href={naverLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 rounded-md text-white hover:bg-opacity-80 bg-green-500 transition-colors duration-300"
          >
            <Image
              src="/images/logo/navermap.png"
              alt="네이버 지도 로고"
              width={24}
              height={24}
              className="h-[1em] w-auto align-middle"
            />
            <span className="ml-2">네이버 지도</span>
          </Link>


          {/* 카카오 길찾기 버튼 */}
          <Link
            href={kakaoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 rounded-md text-black bg-yellow-300 hover:bg-opacity-80 transition-colors duration-300"
          >
            <Image
              src="/images/logo/kakaomap.png"
              alt="카카오맵 로고"
              width={24}
              height={24}
              className="h-[1em] w-auto align-middle"
            />
            <span className="ml-2">카카오맵</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default MapButtons;