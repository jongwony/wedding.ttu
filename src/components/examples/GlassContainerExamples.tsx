import React from 'react';
import GlassContainer from '../ui/GlassContainer';

const GlassContainerExamples = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          GlassContainer 사용 예시
        </h1>

        {/* Default variant */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Default Variant</h2>
          <GlassContainer variant="default" padding="lg" borderRadius="lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">기본 글래스 컨테이너</h3>
            <p className="text-gray-600">
              기본적인 글래스모피즘 효과를 가진 컨테이너입니다.
              웨딩 카운트다운과 같은 메인 콘텐츠에 적합합니다.
            </p>
          </GlassContainer>
        </div>

        {/* Subtle variant */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Subtle Variant</h2>
          <GlassContainer variant="subtle" padding="md" borderRadius="md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">서브틀 컨테이너</h3>
            <p className="text-gray-600">
              더 은은한 효과의 컨테이너입니다.
              부가 정보나 서브 콘텐츠에 적합합니다.
            </p>
          </GlassContainer>
        </div>

        {/* Vibrant variant */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Vibrant Variant</h2>
          <GlassContainer variant="vibrant" padding="xl" borderRadius="xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">비브란트 컨테이너</h3>
            <p className="text-gray-600">
              더 강렬하고 화려한 효과의 컨테이너입니다.
              특별한 강조가 필요한 콘텐츠에 적합합니다.
            </p>
          </GlassContainer>
        </div>

        {/* Different animations */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassContainer
            variant="default"
            animation="fadeInUp"
            padding="md"
            borderRadius="lg"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Fade In Up</h4>
            <p className="text-sm text-gray-600">아래에서 위로 페이드인</p>
          </GlassContainer>

          <GlassContainer
            variant="default"
            animation="gentleFloat"
            padding="md"
            borderRadius="lg"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Gentle Float</h4>
            <p className="text-sm text-gray-600">부드러운 플로팅 애니메이션</p>
          </GlassContainer>

          <GlassContainer
            variant="default"
            animation="none"
            padding="md"
            borderRadius="lg"
          >
            <h4 className="font-semibold text-gray-800 mb-2">No Animation</h4>
            <p className="text-sm text-gray-600">애니메이션 없음</p>
          </GlassContainer>
        </div>

        {/* Different sizes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">다양한 크기</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <GlassContainer variant="default" padding="sm" borderRadius="sm">
              <p className="text-sm text-gray-600">Small</p>
            </GlassContainer>

            <GlassContainer variant="default" padding="md" borderRadius="md">
              <p className="text-sm text-gray-600">Medium</p>
            </GlassContainer>

            <GlassContainer variant="default" padding="lg" borderRadius="lg">
              <p className="text-sm text-gray-600">Large</p>
            </GlassContainer>

            <GlassContainer variant="default" padding="xl" borderRadius="xl">
              <p className="text-sm text-gray-600">Extra Large</p>
            </GlassContainer>
          </div>
        </div>

        {/* 실제 사용 예시 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">실제 사용 예시</h2>

          {/* 카드 리스트 */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassContainer variant="subtle" padding="lg" borderRadius="lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                  💕
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">사랑의 약속</h4>
                  <p className="text-sm text-gray-600">영원히 함께하겠습니다</p>
                </div>
              </div>
            </GlassContainer>

            <GlassContainer variant="subtle" padding="lg" borderRadius="lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  🎉
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">축하의 자리</h4>
                  <p className="text-sm text-gray-600">함께 축하해주세요</p>
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* 통계 카드 */}
          <GlassContainer variant="vibrant" padding="lg" borderRadius="xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">특별한 순간들</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-pink-600">1,000</div>
                  <div className="text-sm text-gray-600">사랑한 날들</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-gray-600">하나된 마음</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">∞</div>
                  <div className="text-sm text-gray-600">영원한 사랑</div>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
};

export default GlassContainerExamples;