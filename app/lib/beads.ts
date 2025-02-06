import { supabase } from './supabase';
import { emotions } from '../types/emotions';

// 구슬 데이터 타입 정의
interface Bead {
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

// 구슬 목록 조회 함수
export async function getBeads() {
  const { data, error } = await supabase
    .from('fyf')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Bead[];
}

// 테스트용 구슬 생성 함수 수정
export async function createTestBeads() {
  try {
    const possibleEmotions = emotions.map(e => e.id);
    
    // 1개의 구슬만 생성
    const numEmotions = Math.floor(Math.random() * 3) + 1;
    const selectedEmotions = [];
    
    for (let j = 0; j < numEmotions; j++) {
      const randomIndex = Math.floor(Math.random() * possibleEmotions.length);
      selectedEmotions.push(possibleEmotions[randomIndex]);
    }

    await createBead(selectedEmotions, "테스트 리뷰입니다.");
    
    return true;
  } catch (error) {
    console.error('Failed to create test beads:', error);
    return false;
  }
}

// 모든 구슬 제거 함수 수정
export async function deleteAllBeads() {
  try {
    const { error } = await supabase
      .from('fyf')
      .delete()
      .not('id', 'is', null); // null이 아닌 모든 행 삭제
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete beads:', error);
    return false;
  }
} 