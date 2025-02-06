'use client';

import { useState, useRef, useEffect } from 'react';
import { emotions } from '../types/emotions';
import EmotionBead from './EmotionBead';
import EmotionButton from './EmotionButton';
import InkDrop from './InkDrop';
import ReviewModal from './ReviewModal';
import CompletionView from './CompletionView';
import { createBead } from '../lib/beads';

interface InkDropInfo {
  id: number;
  color: string;
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  index: number;
  total: number;
}

const MAX_EMOTIONS = 10; // 최대 감정 선택 횟수

export default function EmotionReviewBoard() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [inkDrops, setInkDrops] = useState<InkDropInfo[]>([]);
  const [dropId, setDropId] = useState(0);
  const beadRef = useRef<HTMLDivElement>(null);
  const [beadPosition, setBeadPosition] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [savedReviewId, setSavedReviewId] = useState<string | null>(null);

  const remainingSelections = MAX_EMOTIONS - selectedEmotions.length;

  // 구슬 위치 계산
  useEffect(() => {
    const updateBeadPosition = () => {
      if (beadRef.current) {
        const rect = beadRef.current.getBoundingClientRect();
        setBeadPosition({
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2) + window.scrollY
        });
      }
    };

    updateBeadPosition();
    window.addEventListener('resize', updateBeadPosition);
    window.addEventListener('scroll', updateBeadPosition);
    
    return () => {
      window.removeEventListener('resize', updateBeadPosition);
      window.removeEventListener('scroll', updateBeadPosition);
    };
  }, []);

  const handleEmotionClick = (emotionId: string, event: React.MouseEvent) => {
    if (selectedEmotions.length >= MAX_EMOTIONS) return;
    
    const emotion = emotions.find(e => e.id === emotionId);
    if (!emotion || !beadPosition) return;

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const startPosition = {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2) + window.scrollY
    };

    setInkDrops(prev => [...prev, {
      id: dropId,
      color: emotion.color,
      startPosition,
      targetPosition: beadPosition,
      index: selectedEmotions.length,
      total: MAX_EMOTIONS
    }]);
    setDropId(prev => prev + 1);

    setSelectedEmotions(prev => [...prev, emotionId]);
  };

  const handleInkDropEnd = (id: number) => {
    setInkDrops(prev => prev.filter(drop => drop.id !== id));
  };

  // 각 카테고리별로 첫번째, 중간, 마지막 감정만 선택
  const getThreeEmotions = (categoryEmotions: typeof emotions) => {
    if (categoryEmotions.length < 3) return categoryEmotions;
    
    const first = categoryEmotions[0];
    const middle = categoryEmotions[Math.floor(categoryEmotions.length / 2)];
    const last = categoryEmotions[categoryEmotions.length - 1];
    
    return [first, middle, last];
  };

  const emotionsByCategory = {
    red: getThreeEmotions(emotions.filter(e => e.category === 'red')),
    yellow: getThreeEmotions(emotions.filter(e => e.category === 'yellow')),
    blue: getThreeEmotions(emotions.filter(e => e.category === 'blue')),
    green: getThreeEmotions(emotions.filter(e => e.category === 'green')),
  };

  const handleReset = () => {
    setSelectedEmotions([]);
    setInkDrops([]);
    setDropId(0);
  };

  const handleReviewStart = () => {
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (text: string) => {
    try {
      const newReviewId = await createBead(selectedEmotions, text);
      setSavedReviewId(newReviewId);
      setIsModalOpen(false);
      setShowCompletion(true);
    } catch (error) {
      console.error('Failed to create bead:', error);
      setIsModalOpen(false);
      setShowCompletion(true);
    }
  };

  const handleCompletionEnd = () => {
    setShowCompletion(false);
    setSelectedEmotions([]);
    setInkDrops([]);
    setDropId(0);
  };

  // 완료 화면
  if (showCompletion && savedReviewId) {
    return (
      <CompletionView 
        emotions={selectedEmotions}
        onAnimationEnd={handleCompletionEnd}
        reviewId={savedReviewId}
      />
    );
  }

  // 메인 화면
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-8">
      {/* 로고 */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-6xl font-black text-[#333333] tracking-wider font-pretendard">
          FYF
        </h1>
        <p className="text-sm text-[#333333] mt-1 tracking-wider font-pretendard">
          feel your feelings
        </p>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center">
        <div ref={beadRef} className="scale-75 md:scale-100 -mt-2">
          <EmotionBead 
            emotions={selectedEmotions}
            // textLength={0}
          />
        </div>

        {/* 잉크 드롭 */}
        {inkDrops.map(drop => (
          <InkDrop
            key={drop.id}
            color={drop.color}
            startPosition={drop.startPosition}
            targetPosition={drop.targetPosition}
            index={drop.index}
            total={drop.total}
            onAnimationEnd={() => handleInkDropEnd(drop.id)}
          />
        ))}

        {/* 남은 선택 횟수 표시 */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-lg font-bold text-[#333333] font-pretendard">남은 선택</span>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f4] backdrop-blur-sm">
            <span className="text-md font-bold text-[#333333] font-pretendard">{remainingSelections}</span>
          </div>
        </div>

        {/* 감정어 테이블 */}
        <div className="w-full max-w-2xl px-4 space-y-8 mt-4">
          {/* Green emotions */}
          <div className="flex justify-between items-center">
            {emotionsByCategory.green.map((emotion) => (
              <div key={emotion.id}>
                <EmotionButton
                  emotion={emotion}
                  onClick={(e) => handleEmotionClick(emotion.id, e)}
                  disabled={remainingSelections === 0}
                />
              </div>
            ))}
          </div>

          {/* Yellow emotions */}
          <div className="flex justify-between items-center">
            {emotionsByCategory.yellow.map((emotion) => (
              <div key={emotion.id}>
                <EmotionButton
                  emotion={emotion}
                  onClick={(e) => handleEmotionClick(emotion.id, e)}
                  disabled={remainingSelections === 0}
                />
              </div>
            ))}
          </div>

          {/* Red emotions */}
          <div className="flex justify-between items-center">
            {emotionsByCategory.red.map((emotion) => (
              <div key={emotion.id}>
                <EmotionButton
                  emotion={emotion}
                  onClick={(e) => handleEmotionClick(emotion.id, e)}
                  disabled={remainingSelections === 0}
                />
              </div>
            ))}
          </div>

          {/* Blue emotions */}
          <div className="flex justify-between items-center">
            {emotionsByCategory.blue.map((emotion) => (
              <div key={emotion.id}>
                <EmotionButton
                  emotion={emotion}
                  onClick={(e) => handleEmotionClick(emotion.id, e)}
                  disabled={remainingSelections === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 버튼 - 배경색 수정 */}
      {remainingSelections === 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm mt-auto">
          <div className="max-w-2xl mx-auto flex gap-4 mb-safe">
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-full text-[#333333] font-medium 
                bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              다시하기
            </button>
            <button
              onClick={handleReviewStart}
              className="flex-1 py-4 rounded-full text-white font-medium 
                bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              감정 전달하기
            </button>
          </div>
        </div>
      )}

      {/* 하단 여백 */}
      <div className="h-24" />

      {/* 리뷰 모달 */}
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
} 