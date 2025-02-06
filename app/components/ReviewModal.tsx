'use client';

import { useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText(''); // 입력 초기화
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#333333] mb-4">어떤 감정이 들었나요?</h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            text-[#333333] resize-none"
          placeholder="이야기를 들려주세요."
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-[#333333] font-medium 
              bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full text-white font-medium 
              bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            전달하기
          </button>
        </div>
      </div>
    </div>
  );
} 