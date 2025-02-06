'use client';

import BeadGallery from '../components/BeadGallery';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const [initialBead, setInitialBead] = useState(null);

  useEffect(() => {
    if (reviewId) {
      const fetchSpecificBead = async () => {
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

            setInitialBead({
              ...beadData,
              emotions: emotionIds
            });
          }
        } catch (error) {
          console.error('Failed to fetch specific bead:', error);
        }
      };

      fetchSpecificBead();
    }
  }, [reviewId]);

  return (
    <main>
      <BeadGallery initialBead={initialBead} />
    </main>
  );
} 