import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'vibrant';
  animation?: 'fadeInUp' | 'gentleFloat' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  variant = 'default',
  animation = 'fadeInUp',
  padding = 'lg',
  borderRadius = 'lg'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // fadeInUp 애니메이션이 아닌 경우 바로 표시
    if (animation !== 'fadeInUp') {
      setIsVisible(true);
      return;
    }

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          // 애니메이션이 완료된 후 observer 해제
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // 10%가 보이면 트리거
        rootMargin: '0px 0px -50px 0px' // 아래쪽에서 50px 더 들어와야 트리거
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.unobserve(currentContainer);
    };
  }, [animation, hasAnimated]);

  const variantStyles = {
    default: {
      background: `linear-gradient(135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(248, 250, 252, 0.8) 50%,
        rgba(241, 245, 249, 0.9) 100%
      )`,
      boxShadow: `
        0 20px 40px rgba(190, 165, 190, 0.3),
        0 8px 16px rgba(219, 186, 219, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.8)
      `,
      border: '1px solid rgba(255, 255, 255, 0.6)'
    },
    subtle: {
      background: `linear-gradient(135deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(248, 250, 252, 0.6) 50%,
        rgba(241, 245, 249, 0.7) 100%
      )`,
      boxShadow: `
        0 10px 20px rgba(190, 165, 190, 0.2),
        0 4px 8px rgba(219, 186, 219, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.6)
      `,
      border: '1px solid rgba(255, 255, 255, 0.4)'
    },
    vibrant: {
      background: `linear-gradient(135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(248, 187, 208, 0.3) 30%,
        rgba(219, 186, 219, 0.4) 70%,
        rgba(190, 165, 190, 0.5) 100%
      )`,
      boxShadow: `
        0 25px 50px rgba(190, 165, 190, 0.4),
        0 10px 20px rgba(219, 186, 219, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.9)
      `,
      border: '1px solid rgba(255, 255, 255, 0.7)'
    }
  };

  const paddingStyles = {
    sm: '20px',
    md: '30px',
    lg: '40px',
    xl: '50px'
  };

  const borderRadiusStyles = {
    sm: '15px',
    md: '20px',
    lg: '30px',
    xl: '40px'
  };

  return (
    <>
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-1px) rotate(1deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glass-container-fadeInUp {
          opacity: 0;
          transform: translateY(30px);
        }

        .glass-container-fadeInUp.visible {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .glass-container {
          position: relative;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .glass-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle,
            rgba(219, 186, 219, 0.1) 0%,
            rgba(248, 187, 208, 0.05) 40%,
            transparent 70%
          );
          animation: gentleFloat 6s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        .animation-gentleFloat {
          animation: gentleFloat 4s ease-in-out infinite;
        }

        .animation-none {
          animation: none;
        }
      `}</style>

      <div
        ref={containerRef}
        className={`glass-container
          ${animation === 'fadeInUp' ? `glass-container-fadeInUp ${isVisible ? 'visible' : ''}` : ''}
          ${animation === 'gentleFloat' ? 'animation-gentleFloat' : ''}
          ${className}`}
        style={{
          background: variantStyles[variant].background,
          boxShadow: variantStyles[variant].boxShadow,
          border: variantStyles[variant].border,
          padding: paddingStyles[padding],
          borderRadius: borderRadiusStyles[borderRadius]
        }}
      >
        {children}
      </div>
    </>
  );
};

export default GlassContainer;