'use client';

import EmotionBead from './EmotionBead';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface CompletionViewProps {
  emotions: string[];
  onAnimationEnd: () => void;
  reviewId: string;
}

export default function CompletionView({ emotions, onAnimationEnd, reviewId }: CompletionViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 4초 후에 애니메이션 종료 처리 및 갤러리로 이동
    const timer = setTimeout(() => {
      onAnimationEnd();
      // 현재 경로가 메인 페이지면 갤러리로 이동하지 않음
      if (pathname !== '/') {
        router.push(`/gallery?reviewId=${reviewId}`);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [onAnimationEnd, router, reviewId, pathname]);

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-8 bg-white">
      {/* 로고 */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-8xl font-extrabold text-[#333333] tracking-widest">
          FYF
        </h1>
        <p className="text-sm text-[#333333] mt-1 tracking-wider">
          feel your feelings
        </p>
      </div>

      {/* 상태 메시지 - 마진 조정 */}
      <div className="text-[14px] font-bold text-[#333333] mb-4 mt-10">
        감정 보관소로 이동 중
      </div>

      {/* 구슬 애니메이션 - 위치 더 아래로 조정 */}
      <div className="flex-1 flex items-start justify-center mt-20">
        <div className="animate-roll-away scale-100">
          <div className="scale-100">  {/* 크기 고정을 위한 추가 wrapper */}
            <EmotionBead
              emotions={emotions}
              textLength={0}
              disableBreathing={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 