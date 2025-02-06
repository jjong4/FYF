'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBeads, createTestBeads, deleteAllBeads } from '../lib/beads';
import EmotionBead from './EmotionBead';
import { supabase } from '../lib/supabase';
import { emotions } from '../types/emotions';
import EmotionDistribution from './EmotionDistribution';
import { useRouter } from 'next/navigation';

interface BeadData {
  id: string;
  emotions: string[];
  emotion_types: string[];
  emotion_count: number;
  review?: string;
  created_at: string;
}

interface EmotionCount {
  title: string;
  count: number;
}

interface BeadGalleryProps {
  initialBead?: BeadData | null;
}

export default function BeadGallery({ initialBead }: BeadGalleryProps) {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const [beads, setBeads] = useState<BeadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [newBeadId, setNewBeadId] = useState<string | null>(null);
  const [hoveredBead, setHoveredBead] = useState<string | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  // 초기 구슬 목록 가져오기
  useEffect(() => {
    const fetchBeads = async () => {
      try {
        const { data: beadsData, error } = await supabase
          .from('fyf')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const transformedBeads = beadsData.map(bead => ({
          ...bead,
          emotions: Array.isArray(bead.emotions) 
            ? bead.emotions 
            : typeof bead.emotions === 'string'
              ? JSON.parse(bead.emotions)
              : [bead.emotions].filter(Boolean)
        }));

        setBeads(transformedBeads);
      } catch (error) {
        console.error('Failed to fetch beads:', error);
      }
    };

    fetchBeads();
  }, []);

  // 실시간 업데이트 구독
  useEffect(() => {
    const channel = supabase
      .channel('fyf_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'fyf'
        },
        (payload) => {
          const newBead = payload.new as BeadData;
          const transformedBead = {
            ...newBead,
            emotions: Array.isArray(newBead.emotions)
              ? newBead.emotions
              : typeof newBead.emotions === 'string'
                ? JSON.parse(newBead.emotions)
                : [newBead.emotions].filter(Boolean)
          };
          
          setBeads(prev => [...prev, transformedBead]);  // 새 구슬을 끝에 추가
          setNewBeadId(transformedBead.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateTestBeads = async () => {
    setIsLoading(true);
    try {
      const { data: allBeadsData, error } = await supabase
        .from('fyf')
        .select('*, emotions')
        .order('created_at', { ascending: true })
        .range(fetchedCount, fetchedCount);

      if (error) throw error;
      
      if (allBeadsData && allBeadsData.length > 0) {
        const beadData = allBeadsData[0];
        
        // 1. DB에서 가져온 데이터 확인
        console.log('DB에서 가져온 감정 데이터:', beadData.emotions);

        // 2. 감정 ID 배열이 맞는지 확인하고, 아니라면 배열로 변환
        const emotionIds = Array.isArray(beadData.emotions) 
          ? beadData.emotions 
          : typeof beadData.emotions === 'string'
            ? JSON.parse(beadData.emotions)
            : [beadData.emotions].filter(Boolean);

        console.log('변환된 감정 ID 배열:', emotionIds);

        // 3. 각 ID에 해당하는 emotion 객체 찾기
        const foundEmotions = emotionIds.map(id => 
          emotions.find(e => e.id === id)
        ).filter(Boolean);

        console.log('찾은 감정 객체들:', foundEmotions);
        console.log('구슬에 사용될 색상들:', foundEmotions.map(e => e.color));

        const transformedBead = {
          ...beadData,
          emotions: emotionIds  // 변환된 ID 배열 사용
        };

        setNewBeadId(transformedBead.id);
        setBeads(prev => [transformedBead, ...prev]);
        setFetchedCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to fetch bead:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteAllBeads = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('fyf')
        .delete()
        .not('id', 'is', null);
        
      if (error) throw error;
      setBeads([]);
      setFetchedCount(0);
      setNewBeadId(null);
    } catch (error) {
      console.error('Failed to delete beads:', error);
    }
    setIsLoading(false);
  };

  // 감정 횟수를 계산하는 함수
  const getEmotionCounts = (emotionIds: string[]): EmotionCount[] => {
    const counts: { [key: string]: number } = {};
    
    emotionIds.forEach(id => {
      const emotion = emotions.find(e => e.id === id);
      if (emotion) {
        counts[emotion.title] = (counts[emotion.title] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([title, count]) => ({
      title,
      count
    }));
  };

  // 특정 리뷰 자동 호출
  useEffect(() => {
    if (reviewId) {
      const fetchSpecificBead = async () => {
        setIsLoading(true);
        try {
          const { data: beadData, error } = await supabase
            .from('fyf')
            .select('*')
            .eq('id', reviewId)
            .single();

          if (error) throw error;
          
          if (beadData) {
            const emotionIds = Array.isArray(beadData.emotions) 
              ? beadData.emotions 
              : typeof beadData.emotions === 'string'
                ? JSON.parse(beadData.emotions)
                : [beadData.emotions].filter(Boolean);

            const transformedBead = {
              ...beadData,
              emotions: emotionIds
            };

            setBeads(prev => [transformedBead, ...prev]);
            setNewBeadId(transformedBead.id);
          }
        } catch (error) {
          console.error('Failed to fetch specific bead:', error);
        }
        setIsLoading(false);
      };

      fetchSpecificBead();
    }
  }, [reviewId]);

  return (
    <div className="h-screen bg-[#000000] flex flex-col">
      {/* 오디오 플레이어 */}
      <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[#333333] hover:text-[#666666] transition-colors"
        >
          {isPlaying ? '🔊' : '🔈'}
        </button>
        <audio
          src="/bgm.mp3"  // public 폴더에 음악 파일 필요
          loop
          autoPlay={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          ref={(audio) => {
            if (audio) {
              isPlaying ? audio.play() : audio.pause();
            }
          }}
        />
      </div>

      

      <div className="absolute top-16 left-16 z-10">
        <h1 className="text-8xl font-black text-[#FFFFFF] tracking-wider font-montserrat">
          FYF
        </h1>
        <br></br><br></br>
        <p className="text-sm text-[#ffffff] mt-1 tracking-normal font-pretendard">
        플래버는 구장에서 수많은 감정을 경험합니다. 기쁨, 설렘, 아쉬움, 슬픔
        그리고 말로 다 표현할 수 없는 미묘한 감정들까지.<br></br>
        플래버가 느끼는 감정을 헤아려보는 건 우리의 미션과도 크게 맞닿아있어요.<br></br>
        감정 저장소는 플래버의 소중한 이야기를 담아둔 곳입니다.<br></br>
        이곳에서 플래버가 느끼는 모든 감정을 살펴보고 함께 공감해보세요. 
        </p>
      </div>

      <br></br><br></br><br></br><br></br><br></br><br></br>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center h-full min-w-max pl-[calc(50vw-160px)]">
          {[...beads].reverse().map((bead, index) => (
            <div 
              key={bead.id}
              className="w-11 h-11 mx-12 relative transition-all duration-300 hover:shadow-[0_0_80px_40px_rgba(255,255,255,0.2)]"
              onMouseEnter={() => setHoveredBead(bead.id)}
              onMouseLeave={() => setHoveredBead(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformOrigin: 'center center',
                position: 'relative',
                animation: bead.id === newBeadId
                  ? 'rollIn 1s ease-out'
                  : `shiftRight${index} 0.3s ease-out 0.9s forwards`,
                transform: `translateX(${index * 160}px)`,
              }}
            >
              <EmotionBead 
                emotions={bead.emotions}
                textLength={bead.review?.length || 0}
                disableBreathing={true}  // breathing 효과 비활성화
              />
              
              {/* Hover 팝업 */}
              {hoveredBead === bead.id && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-lg p-4 min-w-[200px] shadow-lg z-10">
                  <div className="text-sm font-bold mb-2 text-[#333333]">감정 상세</div>
                  {getEmotionCounts(bead.emotions).map((item, i) => {
                    const emotion = emotions.find(e => e.title === item.title);
                    return (
                      <div key={i} className="flex justify-between items-center text-sm mb-1">
                        <span style={{ color: emotion?.color }}>{item.title}</span>
                        <span className="ml-2 text-[#333333]">{item.count}회</span>
                      </div>
                    );
                  })}

                  <div className="mt-4 mb-4">  {/* 여백 추가 */}
                    <EmotionDistribution emotions={bead.emotions} />
                  </div>
                  
                  {/* Review 내용 */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-sm font-bold mb-2 text-[#333333]">이야기</div>
                    <div className="text-sm text-[#333333] break-words">
                      {bead.review || "리뷰 내용이 없습니다."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes rollIn {
          0% {
            transform: translateX(-100vw) rotate(-360deg) scale(1);
            opacity: 0;
          }
          95% {
            transform: translateX(0) rotate(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotate(0) scale(1);
            opacity: 1;
          }
        }

        ${[...beads].reverse().map((_, index) => index > 0 ? `
          @keyframes shiftRight${index} {
            0% {
              transform: translateX(${index * 160}px);
            }
            20% {
              transform: translateX(${index * 160 + 5}px) scale(0.95);
            }
            100% {
              transform: translateX(${(index + 1) * 160}px);
            }
          }
        ` : '').join('\n')}
      `}</style>
    </div>
  );
}