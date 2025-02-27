import Dining from '@/components/Dining';
import Link from 'next/link';

const DiningPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-md">
        <h1 className="text-xl font-bold text-center mt-8 mb-8">
          그랑뷔페 한식다이닝
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-4">
          예식에서 가장 중요한 순간 중 하나는 <strong className="text-gray-700 dark:text-gray-300">정성스러운 식사</strong>입니다.
          <span className="block mt-2">
            모든 손님께 기억에 남을 <strong className="text-gray-700 dark:text-gray-300">한 끼의 품격</strong>을 선사하기 위해
          </span>
          손님 모두를 위한 특별한 경험을 준비했습니다.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-6">
          메인 메뉴인 한정식 한상차림 <strong className="text-gray-700 dark:text-gray-300">정</strong>의 정통성을 강화하고,<br />
          뷔페 메뉴인 <strong className="text-gray-700 dark:text-gray-300">밥</strong>을 새롭게 재해석하여 탄생한
          <span className="block mt-2">
            한정식과 뷔페의 특별한 조합을 만나보세요.
          </span>
        </p>
        <div className="flex justify-center w-full">
          <Dining />
        </div>
        <div className="flex justify-center">
          <Link
            href="https://starcityarthall.com/html/dining.php"
            className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-opacity-80 transition-colors"
          >
            연회 메뉴 자세히 보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiningPage;