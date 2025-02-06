import { supabase } from './supabase';
import { emotions } from '../types/emotions';

// 구슬 데이터 타입 정의
interface BeadData {
  id: string;
  emotions: string[];
  emotion_types: string[];
  emotion_count: number;
  review?: string;
  created_at: string;
}

// 구슬 생성 함수
export async function createBead(selectedEmotions: string[], review?: string): Promise<string> {
  const emotionTypes = selectedEmotions.map(id => {
    const emotion = emotions.find(e => e.id === id);
    return emotion?.category || '';
  });

  const { data, error } = await supabase
    .from('fyf')
    .insert([
      {
        emotions: selectedEmotions,
        emotion_types: emotionTypes,
        emotion_count: selectedEmotions.length,
        review: review,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from insert');
  
  return data.id;  // ID만 반환하도록 수정
} 