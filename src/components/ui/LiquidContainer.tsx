'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// 타입 정의
interface MousePosition {
  x: number;
  y: number;
}

interface ShaderOptions {
  width?: number;
  height?: number;
  fragment?: (uv: { x: number; y: number }, mouse: MousePosition) => { type: string; x: number; y: number };
}

interface LiquidGlassProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
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
  private fragment: (uv: { x: number; y: number }, mouse: MousePosition) => { type: string; x: number; y: number };
  private canvasDPI: number;
  private id: string;
  private offset: number;
  private mouse: MousePosition;
  private mouseUsed: boolean;
  private container!: HTMLDivElement;
  private svg!: SVGSVGElement;
  private feImage!: SVGFEImageElement;
  private feDisplacementMap!: SVGFEDisplacementMapElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private isDragging: boolean;
  private startX: number;
  private startY: number;
  private initialX: number;
  private initialY: number;

  constructor(options: ShaderOptions = {}) {
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
    this.canvasDPI = 1;
    this.id = generateId();
    this.offset = 10;
    this.mouse = { x: 0, y: 0 };
    this.mouseUsed = false;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.initialX = 0;
    this.initialY = 0;

    this.createElement();
    this.setupEventListeners();
    this.updateShader();
  }

  private createElement(): void {
    // 컨테이너 생성
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 3%;
      left: 80%;
      // transform: translate(-50%, -50%);
      width: ${this.width}px;
      height: ${this.height}px;
      overflow: hidden;
      border-radius: 150px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15);
      cursor: grab;
      backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
      z-index: 9999;
      pointer-events: auto;
    `;

    // SVG 필터 생성
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9998;
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

  private constrainPosition(x: number, y: number): { x: number; y: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 오프셋과 함께 경계 계산
    const minX = this.offset;
    const maxX = viewportWidth - this.width - this.offset;
    const minY = this.offset;
    const maxY = viewportHeight - this.height - this.offset;

    // 위치 제한
    const constrainedX = Math.max(minX, Math.min(maxX, x));
    const constrainedY = Math.max(minY, Math.min(maxY, y));

    return { x: constrainedX, y: constrainedY };
  }

  private setupEventListeners(): void {
    // 마우스 다운 이벤트
    const handleMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.container.style.cursor = 'grabbing';
      this.startX = e.clientX;
      this.startY = e.clientY;
      const rect = this.container.getBoundingClientRect();
      this.initialX = rect.left;
      this.initialY = rect.top;
      e.preventDefault();
    };

    // 마우스 이동 이벤트
    const handleMouseMove = (e: MouseEvent) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        // 새로운 위치 계산
        const newX = this.initialX + deltaX;
        const newY = this.initialY + deltaY;

        // 뷰포트 경계 내에서 위치 제한
        const constrained = this.constrainPosition(newX, newY);

        this.container.style.left = constrained.x + 'px';
        this.container.style.top = constrained.y + 'px';
        this.container.style.transform = 'none';
      }

      // 셰이더를 위한 마우스 위치 업데이트
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / rect.width;
      this.mouse.y = (e.clientY - rect.top) / rect.height;

      if (this.mouseUsed) {
        this.updateShader();
      }
    };

    // 마우스 업 이벤트
    const handleMouseUp = () => {
      this.isDragging = false;
      this.container.style.cursor = 'grab';
    };

    // 윈도우 리사이즈 이벤트
    const handleResize = () => {
      const rect = this.container.getBoundingClientRect();
      const constrained = this.constrainPosition(rect.left, rect.top);

      if (rect.left !== constrained.x || rect.top !== constrained.y) {
        this.container.style.left = constrained.x + 'px';
        this.container.style.top = constrained.y + 'px';
        this.container.style.transform = 'none';
      }
    };

    // this.container.addEventListener('mousedown', handleMouseDown);
    // document.addEventListener('mousemove', handleMouseMove);
    // document.addEventListener('mouseup', handleMouseUp);
    // window.addEventListener('resize', handleResize);

    // 정리를 위한 이벤트 리스너 저장
    this.container.setAttribute('data-handlers', 'attached');
  }

  private updateShader(): void {
    const mouseProxy = new Proxy(this.mouse, {
      get: (target, prop) => {
        this.mouseUsed = true;
        return target[prop as keyof MousePosition];
      }
    });

    this.mouseUsed = false;

    const w = this.width * this.canvasDPI;
    const h = this.height * this.canvasDPI;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment(
        { x: x / w, y: y / h },
        mouseProxy
      );
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
    parent.appendChild(this.container);
  }

  public destroy(): void {
    // 이벤트 리스너 정리
    const handlers = this.container.getAttribute('data-handlers');
    if (handlers) {
      // 실제로는 이벤트 리스너를 제거하기 위해 참조를 유지해야 하지만,
      // 여기서는 DOM 요소 제거로 대체합니다.
    }

    this.svg.remove();
    this.container.remove();
    this.canvas.remove();
  }
}

// React 컴포넌트
const LiquidGlass: React.FC<LiquidGlassProps> = ({
  width = 300,
  height = 200,
  className = '',
  style = {}
}) => {
  const shaderRef = useRef<Shader | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 셰이더 생성 함수
  const createShader = useCallback(() => {
    if (shaderRef.current) {
      shaderRef.current.destroy();
    }

    const shader = new Shader({
      width,
      height,
      fragment: (uv, mouse) => {
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
    shader.appendTo(document.body);
    setIsInitialized(true);
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
    if (isInitialized) {
      createShader();
    }
  }, [width, height, isInitialized, createShader]);

  // 이 컴포넌트는 실제로 DOM에 아무것도 렌더링하지 않습니다.
  // 모든 요소는 document.body에 직접 추가됩니다.
  return null;
};

export default LiquidGlass;
