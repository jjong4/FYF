'use client';

import { Emotion } from '../types/emotions';

interface EmotionButtonProps {
  emotion: Emotion;
  onClick: (event: React.MouseEvent) => void;
  disabled?: boolean;
}

export default function EmotionButton({ emotion, onClick, disabled }: EmotionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-20 h-20 rounded-full text-white text-sm font-medium 
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
      style={{ 
        backgroundColor: emotion.color.replace('1)', '0.85)'),
        boxShadow: `0 0 15px ${emotion.color.replace('1)', '0.5)')}`
      }}
    >
      <span className="px-2 font-medium font-pretendard">
        {emotion.title}
      </span>
    </button>
  );
} 