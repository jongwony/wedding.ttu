'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// 타입 정의
interface ShaderOptions {
  width?: number;
  height?: number;
  fragment?: (uv: { x: number; y: number }) => { type: string; x: number; y: number };
}

interface LiquidGlassProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// 유틸리티 함수들
function smoothStep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(x: number, y: number, width: number, height: number, radius: number): number {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

function texture(x: number, y: number): { type: string; x: number; y: number } {
  return { type: 't', x, y };
}

// 고유 ID 생성
function generateId(): string {
  return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
}

// Shader 클래스
class Shader {
  private width: number;
  private height: number;
  private fragment: (uv: { x: number; y: number }) => { type: string; x: number; y: number };
  private canvasDPI: number;
  private id: string;
  private container!: HTMLDivElement;
  private svg!: SVGSVGElement;
  private feImage!: SVGFEImageElement;
  private feDisplacementMap!: SVGFEDisplacementMapElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  constructor(options: ShaderOptions = {}) {
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
    this.canvasDPI = 1;
    this.id = generateId();

    this.createElement();
    this.updateShader();
  }

  private createElement(): void {
    // SVG 필터 생성
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    `;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `${this.id}_filter`);
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('colorInterpolationFilters', 'sRGB');
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', this.width.toString());
    filter.setAttribute('height', this.height.toString());

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('id', `${this.id}_map`);
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    // 디스플레이스먼트 맵용 캔버스 생성 (숨김)
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;
    this.canvas.style.display = 'none';

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context를 가져올 수 없습니다.');
    }
    this.context = context;
  }

  private updateShader(): void {
    const w = this.width * this.canvasDPI;
    const h = this.height * this.canvasDPI;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h });
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5;
      const g = rawValues[index++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.context.putImageData(new ImageData(data, w, h), 0, 0);
    this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
    this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
  }

  public appendTo(parent: HTMLElement): void {
    parent.appendChild(this.svg);
    parent.appendChild(this.canvas);
  }

  public getFilterId(): string {
    return `${this.id}_filter`;
  }

  public destroy(): void {
    this.svg.remove();
    this.canvas.remove();
  }
}

// React 컴포넌트
const LiquidGlass: React.FC<LiquidGlassProps> = ({
  width = 300,
  height = 200,
  className = '',
  style = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<Shader | null>(null);
  const [filterId, setFilterId] = useState<string>('');

  // 셰이더 생성 함수
  const createShader = useCallback(() => {
    if (!containerRef.current) return;

    if (shaderRef.current) {
      shaderRef.current.destroy();
    }

    const shader = new Shader({
      width,
      height,
      fragment: (uv) => {
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        const distanceToEdge = roundedRectSDF(
          ix,
          iy,
          0.3,
          0.2,
          0.6
        );
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        return texture(ix * scaled + 0.5, iy * scaled + 0.5);
      }
    });

    shaderRef.current = shader;
    setFilterId(shader.getFilterId());
    shader.appendTo(containerRef.current);
  }, [width, height]);

  // 컴포넌트 마운트 시 셰이더 생성
  useEffect(() => {
    createShader();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (shaderRef.current) {
        shaderRef.current.destroy();
        shaderRef.current = null;
      }
    };
  }, [createShader]);

  // 크기 변경 시 셰이더 재생성
  useEffect(() => {
    if (containerRef.current) {
      createShader();
    }
  }, [width, height, createShader]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        borderRadius: '150px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)',
        backdropFilter: filterId ? `url(#${filterId}) blur(0.25px) contrast(1.1) brightness(1.05) saturate(1.1)` : 'blur(0.25px)',
        WebkitBackdropFilter: filterId ? `url(#${filterId}) blur(0.25px) contrast(1.1) brightness(1.05) saturate(1.1)` : 'blur(0.25px)',
        background: filterId ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default LiquidGlass;
