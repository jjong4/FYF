'use client';

import { emotions } from '../types/emotions';

interface EmotionBeadProps {
  emotions: string[];  // emotion ids
  textLength: number;
  disableBreathing?: boolean;  // 새로운 prop 추가
  className?: string;
}

export default function EmotionBead({ emotions: emotionIds, textLength, disableBreathing = false }: EmotionBeadProps) {
  // 각 감정의 등장 횟수 계산
  const emotionCounts = emotionIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 중복 제거된 감정 목록
  const uniqueEmotions = Array.from(new Set(emotionIds))
    .map(id => emotions.find(e => e.id === id))
    .filter(Boolean);

  return (
    <div className={`relative ${disableBreathing ? '' : 'animate-breathing'}`}>
      {/* 빈 구슬 */}
      <div 
        className="w-[300px] h-[300px] rounded-full"
        style={{
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(240, 240, 255, 0.6) 25%,
              rgba(230, 240, 255, 0.6) 50%,
              rgba(240, 240, 255, 0.6) 75%,
              rgba(255, 255, 255, 0.7) 100%
            )
          `,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          filter: 'blur(0.5px)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
        }}
      />

      {/* 잉크 중첩 효과 */}
      {uniqueEmotions.map((emotion, index) => {
        const angle = (index / uniqueEmotions.length) * 2 * Math.PI;
        const x = 50 + Math.cos(angle) * 20;
        const y = 50 + Math.sin(angle) * 20;

        // 감정 중복 횟수에 따른 색상 세기 조정
        const count = emotionCounts[emotion.id];
        const opacity = Math.min(0.1 + (count - 1) * 0.15, 0.9); // 기본 0.3, 중복당 0.2씩 증가, 최대 0.9

        const style = {
          background: `radial-gradient(
            circle at ${x}% ${y}%,
            ${emotion?.color} 0%,
            ${emotion?.color} ${10 + count * 12}%,
            transparent 54%
          )`,
          animationDelay: `${index * 0.05}s`,
          opacity: opacity,
        };

        return (
          <div
            key={`${emotion?.id}-${index}`}
            className="absolute inset-0 w-[300px] h-[300px] rounded-full animate-ink-absorb mix-blend-color"
            style={style}
          />
        );
      })}

      {/* 구슬의 광택 효과 */}
      <div 
        className="absolute inset-0 w-[300px] h-[300px] rounded-full"
        style={{
          background: `
            radial-gradient(
              circle at 80% 80%,
              rgba(255, 255, 255, 0.2) 0%,
              transparent 90%
            )
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
} 