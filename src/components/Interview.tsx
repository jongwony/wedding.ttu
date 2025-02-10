"use client";
import React, { useState } from "react";

const InterviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-24 text-3xl font-nanumdahang font-semibold">
          신랑신부 인터뷰
      </h2>

      <p className="font-maru text-gray-400 m-4">
        신랑과 신부의 인터뷰를 통해 서로에 대해 더 잘 알아보세요.
      </p>

      {/* 인터뷰 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-pink-400"
      >
        신랑신부 인터뷰 읽어보기
      </button>

      {/* 모달 백그라운드 */}
      {isOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black flex justify-center z-50 overflow-y-scroll">
          <div className="p-8 mt-8 font-nanumdahang">
            {/* 헤더 */}
            <div className="flex justify-center items-center border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                신랑 신부 인터뷰
              </h3>
            </div>

            {/* 인터뷰 내용 */}
            <div className="flex flex-col gap-8 mt-8 text-left text-gray-700">
              <div className="flex flex-col gap-4 border-b pb-8">
                <h4 className="text-xl text-pink-500 font-semibold">
                  1. 서로의 첫인상은 어땠나요?
                </h4>
                <p className="flex flex-col gap-2 text-gray-600">
                  <strong>신랑:</strong> 카페에서 처음 본날 환하게 웃고 있는 수경이가 너무 예뻤어요.
                  <br />
                  <strong>신부:</strong> 처음엔 수염때문에 무서웠는데 한없이 귀여운 사람이었어요.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-b pb-8">
                <h4 className="text-xl text-pink-500 font-semibold">
                  2. 결혼을 결심하게 된 계기가 있나요?
                </h4>
                <p className="flex flex-col gap-2 text-gray-600">
                  <strong>신랑:</strong> 수경이와 쇼핑하던 날, 그냥 평생 이렇게 같이 장보고 싶다 생각했어요.
                  <br />
                  <strong>신부:</strong> 티쳐스 프로그램을 보는데 배우면서 오빠와의 미래를 꿈꾸게 됐어요.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-b pb-8">
                <h4 className="text-xl text-pink-500 font-semibold">
                  3. 30년 후 두 사람은 어떤 모습일 것 같나요?
                </h4>
                <p className="flex flex-col gap-2 text-gray-600">
                  <strong>신랑:</strong> 손잡고 석촌호수를 돌고 있을 것 같아요.
                  <br />
                  <strong>신부:</strong> 오빠랑 손잡고 산책할래요!
                </p>
              </div>

              <div className="flex flex-col gap-4 border-b pb-8">
                <h4 className="text-xl text-pink-500 font-semibold">
                  4. 결혼생활에 대한 각오 한마디
                </h4>
                <p className="flex flex-col gap-2 text-gray-600">
                  <strong>신랑:</strong> 수경이가 저의 평생 1순위로 살겠습니다.
                  <br />
                  <strong>신부:</strong> 오빠의 노력과 능력을 인정하며 언제나 응원할게요.
                </p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <div className="p-8 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-500"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewModal;