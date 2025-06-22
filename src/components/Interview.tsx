"use client";
import React, { useState } from "react";
import GlassContainer from "./ui/GlassContainer";

const InterviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterOpening, setIsLetterOpening] = useState(false);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setIsLetterOpening(true);
    // 편지 열기 애니메이션 완료 후 상태 변경
    setTimeout(() => {
      setIsLetterOpening(false);
    }, 1000);
  };

  const handleCloseLetter = () => {
    setIsOpen(false);
    setIsLetterOpening(false);
  };

  return (
    <>
      <style jsx>{`
        @keyframes letterOpen {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          30% {
            transform: translateY(-2px) scale(1.02);
            opacity: 0.95;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes envelopeFlip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        @keyframes letterUnfold {
          0% {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes heartBeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .letter-opening {
          animation: letterOpen 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .envelope-button {
          transition: all 0.3s ease;
        }

        .envelope-button:hover {
          transform: translateY(-5px);
          animation: heartBeat 1s ease-in-out infinite;
        }

        .letter-content {
           animation: letterUnfold 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
         }

        .question-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .floating-hearts {
          position: absolute;
          top: -10px;
          right: -10px;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) rotate(360deg);
            opacity: 0;
          }
        }

        .heart-float {
          animation: floatUp 2s ease-out infinite;
        }

        .heart-float:nth-child(2) {
          animation-delay: 0.5s;
        }

        .heart-float:nth-child(3) {
          animation-delay: 1s;
        }
      `}</style>

      <div className="mt-16 mb-16 flex flex-col items-center p-4 relative">
        <GlassContainer
          variant="vibrant"
          animation="fadeInUp"
          padding="xl"
          borderRadius="xl"
          className="text-center max-w-md mx-auto relative"
        >
          <div className="floating-hearts">
            <div className="heart-float text-pink-400 text-lg">💕</div>
            <div className="heart-float text-pink-500 text-lg">💖</div>
            <div className="heart-float text-pink-600 text-lg">💝</div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl text-pink-500 font-bold mb-2">
              💌 러브레터
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              신랑과 신부의 진솔한 이야기를
              <br />
              편지로 담았습니다
            </p>
          </div>

          <button
            onClick={handleOpenLetter}
            className="envelope-button bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-8 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span className="text-2xl">📧</span>
            편지 열어보기
          </button>
        </GlassContainer>

        {/* 편지 모달 */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
            <div
              className={`w-full max-w-4xl mt-4 mb-8 ${isLetterOpening ? 'letter-opening' : ''}`}
            >
              <GlassContainer
                variant="default"
                animation="none"
                padding="sm"
                borderRadius="md"
                className={`letter-content ${!isLetterOpening ? 'animate-in' : ''}`}
              >
                {/* 편지 헤더 */}
                <div className="text-center mb-8 pb-6 border-b-2 border-pink-200">
                  <h3 className="text-2xl font-bold text-pink-500 mb-2">
                    💝 신랑 신부 인터뷰
                  </h3>
                  <p className="text-gray-600">
                    사랑이 담긴 진솔한 이야기
                  </p>
                </div>

                {/* 인터뷰 내용 - 모바일 최적화 */}
                <div className="space-y-8">
                  {/* 질문 1 */}
                  <div className="question-card bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                    <h4 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💗</span>
                      서로의 첫인상은 어땠나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">카페에서 처음 본날 환하게 웃고 있는 수경이가 너무 예뻤어요.</span>
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">처음엔 수염때문에 무서웠는데 한없이 귀여운 사람이었어요.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 2 */}
                  <div className="question-card bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💕</span>
                      결혼을 결심하게 된 계기가 있나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">수경이와 쇼핑하던 날, 그냥 평생 이렇게 같이 장보고 싶다 생각했어요.</span>
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">티쳐스 프로그램을 보는데 배우면서 오빠와의 미래를 꿈꾸게 됐어요.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 3 */}
                  <div className="question-card bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
                    <h4 className="text-xl font-bold text-rose-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🌹</span>
                      30년 후 두 사람은 어떤 모습일 것 같나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">손잡고 석촌호수를 돌고 있을 것 같아요.</span>
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">오빠랑 손잡고 산책할래요!</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 4 */}
                  <div className="question-card bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <h4 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💒</span>
                      결혼생활에 대한 한마디
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">수경이가 저의 평생 1순위로 살겠습니다.</span>
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">오빠의 노력과 능력을 인정하며 언제나 응원할게요.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 닫기 버튼 */}
                <div className="text-center mt-10 pt-6 border-t-2 border-pink-200">
                  <button
                    onClick={handleCloseLetter}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-8 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:from-gray-500 hover:to-gray-600"
                  >
                    편지 접기 📧
                  </button>
                </div>
              </GlassContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewModal;