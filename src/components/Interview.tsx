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
          transform: translateY(-1px);
          animation: heartBeat 3s ease-in-out infinite;
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

        .heart-float:nth-child(4) {
          animation-delay: 1.5s;
        }
      }`}</style>

      <div className="flex flex-col items-center p-4 relative">
        <GlassContainer
          variant="vibrant"
          animation="gentleFloat"
          padding="xl"
          borderRadius="xl"
          className="text-center max-w-md mx-auto relative"
        >
          <div className="floating-hearts">
            <div className="heart-float text-pink-400 text-lg">💕</div>
            <div className="heart-float text-pink-500 text-lg">💖</div>
            <div className="heart-float text-pink-600 text-lg">💝</div>
            <div className="heart-float text-pink-700 text-lg">💗</div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-3xl text-[var(--header)] font-bold">
               러브레터
            </h2>
            <p className="text-[var(--subtitle)] text-lg leading-relaxed p-4">
              신랑과 신부의 진솔한 이야기를
              <br />
              편지로 담았습니다
            </p>
          </div>

          <button
            onClick={handleOpenLetter}
            className="envelope-button bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-8 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span className="text-2xl">💌</span>
            편지 열어보기
          </button>
        </GlassContainer>

        {/* 편지 모달 */}
        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-start z-50 overflow-y-auto p-2" style={{
            /* Liquid Glass 배경 */
            background: `var(--glass-bg)`,
            /* Specular Highlights - 유리 반사광 효과 */
            boxShadow: 'var(--glass-box-shadow)',
            /* 유리 테두리 */
            border: 'var(--glass-border)',
            /* Backdrop Filter - 배경 블러 및 색상 강조 */
            backdropFilter: 'var(--glass-backdrop)',
            WebkitBackdropFilter: 'var(--glass-backdrop)',
          }}>
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
                  <h3 className="text-2xl font-bold text-[var(--header)] mb-2">
                    💝 신랑 신부 인터뷰
                  </h3>
                  <p className="text-[var(--subtitle)]">
                    사랑이 담긴 진솔한 이야기
                  </p>
                </div>

                {/* 인터뷰 내용 - 모바일 최적화 */}
                <div className="space-y-8">
                  {/* 질문 1 */}
                  <div className="question-card rounded-xl">
                    <h4 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💗</span>
                      서로의 첫 인상은 어땠나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">처음 카페에서 만난 수경이의 밝은 미소가 아직도 기억에 남아요. 그 미소를 보는 순간 괜히 마음이 설레더라고요. 그리고 수경이와 이야기를 나누다 보니, 자연스럽게 더 알고 싶다는 생각이 들었습니다.</span>
                        </p>
                      </div>
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">솔직히… 처음엔 수염도 있고 인상이 조금 강해서 살짝 무서웠어요. 근데 자꾸 보다 보니까 잘생겼다? 싶었고, 알고 보니 정말 따뜻한 사람이었어요!</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 2 */}
                  <div className="question-card rounded-xl">
                    <h4 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💕</span>
                      결혼을 결심하게 된 계기가 있나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">수경이와 함께 있을 때면 사소한 일상도 특별하게 느껴졌어요. 가끔 티격태격해도, 그 순간조차 우리 미래를 그리게 해줬죠. 결혼 준비를 하면서 평생 이 사람과 함께할 수 있겠다는 확신이 들었습니다.</span>
                        </p>
                      </div>
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">특별한 계기보다는, 함께한 평범한 순간들이 마음을 바꿨어요. 꾸미지 않은 나의 모습까지 따뜻하게 바라봐 주는 사람과 함께 있는 시간이 참 좋았고, 이 순간이 오래 계속되길 바라는 마음이 어느새 함께할 미래를 그리고, 그 미래를 함께하고 싶다는 결심으로 이어졌어요.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 3 */}
                  <div className="question-card rounded-xl">
                    <h4 className="text-xl font-bold text-rose-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🌹</span>
                      30년 후 두 사람은 어떤 모습일 것 같나요?
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">아마 아이들과 함께 시끌벅적하게, 주말마다 여기저기 여행 다니며 소소한 행복을 나누고 있을 것 같아요. 여전히 수경이 손 꼭 잡고 다니면서요.</span>
                        </p>
                      </div>
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">늙어서도 쉬는 날이면 둘이 손잡고 예쁜 카페를 찾아다닐 것 같아요. 오빠는 노트북 펴서 코딩하고, 저는 그 옆에서 맛있는 빵을 먹으며 함께 있는 시간을 즐기고 있겠죠.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 질문 4 */}
                  <div className="question-card rounded-xl">
                    <h4 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💒</span>
                      결혼생활에 대한 한마디
                    </h4>
                    <div className="space-y-4 text-left">
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-600">🤵 신랑:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2">수경이가 제 인생의 1순위라는 마음은 앞으로도 변치 않을 거예요. 함께하는 모든 순간을 소중히 여기며 사랑할게요</span>
                        </p>
                      </div>
                      <div className="rounded-lg pt-4 pb-4">
                        <p className="text-gray-700">
                          <span className="font-bold text-pink-600">👰 신부:</span>
                          <br className="md:hidden" />
                          <span className="md:ml-2"> 오빠의 노력과 능력을 인정하며, 언제나 든든한 편이 되어줄게요.</span>
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
                   💌 편지 접기
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