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