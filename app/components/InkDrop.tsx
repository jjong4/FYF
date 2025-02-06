'use client';

interface InkDropProps {
  color: string;
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onAnimationEnd: () => void;
  index: number;
  total: number;
}

export default function InkDrop({ 
  color, 
  startPosition, 
  targetPosition, 
  onAnimationEnd,
  index,
  total
}: InkDropProps) {
  // 최종 목표 위치 계산 (구슬 내 특정 영역)
  const angle = (index / total) * 2 * Math.PI;
  const radius = 40;
  const finalX = targetPosition.x + radius * Math.cos(angle);
  const finalY = targetPosition.y + radius * Math.sin(angle);

  // 시작 위치에서 목표 위치까지의 거리 계산
  const targetX = finalX - startPosition.x;
  const targetY = finalY - startPosition.y;

  return (
    <div 
      className="absolute w-3 h-3 rounded-full animate-ink-drop"
      style={{ 
        backgroundColor: color,
        left: startPosition.x,
        top: startPosition.y,
        '--target-x': `${targetX}px`,
        '--target-y': `${targetY}px`,
      } as React.CSSProperties}
      onAnimationEnd={onAnimationEnd}
    />
  );
} 