export interface Emotion {
  id: string;
  title: string;
  color: string;
  category: 'red' | 'yellow' | 'blue' | 'green';
}

export const emotions: Emotion[] = [
  // Red emotions
  {
    id: 'emotion_red_peeved',
    title: '언짢아요',
    color: 'rgba(249, 123, 38, 1)',
    category: 'red'
  },
  {
    id: 'emotion_red_nervous',
    title: '초조해요',
    color: 'rgba(248, 86, 39, 1)',
    category: 'red'
  },
  {
    id: 'emotion_red_angry',
    title: '화나요',
    color: 'rgba(221, 71, 38, 1)',
    category: 'red'
  },
  {
    id: 'emotion_red_frightned',
    title: '겁이나요',
    color: 'rgba(187, 34, 36, 1)',
    category: 'red'
  },
  {
    id: 'emotion_red_repulsed',
    title: '불쾌해요',
    color: 'rgba(130, 31, 34, 1)',
    category: 'red'
  },
  // Yellow emotions
  {
    id: 'emotion_yellow_hyper',
    title: '들떠요',
    color: 'rgba(250, 231, 103, 1)',
    category: 'yellow'
  },
  {
    id: 'emotion_yellow_joyful',
    title: '기뻐요',
    color: 'rgba(249, 213, 57, 1)',
    category: 'yellow'
  },
  {
    id: 'emotion_yellow_happy',
    title: '행복해요',
    color: 'rgba(249, 203, 58, 1)',
    category: 'yellow'
  },
  {
    id: 'emotion_yellow_playful',
    title: '재밌어요',
    color: 'rgba(249, 183, 60, 1)',
    category: 'yellow'
  },
  {
    id: 'emotion_yellow_thrilled',
    title: '짜릿해요',
    color: 'rgba(249, 173, 38, 1)',
    category: 'yellow'
  },
  // Blue emotions
  {
    id: 'emotion_blue_fatigued',
    title: '지쳐요',
    color: 'rgba(128, 207, 255, 1)',
    category: 'blue'
  },
  {
    id: 'emotion_blue_bored',
    title: '지루해요',
    color: 'rgba(39, 160, 233, 1)',
    category: 'blue'
  },
  {
    id: 'emotion_blue_disappointed',
    title: '실망이에요',
    color: 'rgba(38, 114, 226, 1)',
    category: 'blue'
  },
  {
    id: 'emotion_blue_glum',
    title: '침울해요',
    color: 'rgba(35, 72, 186, 1)',
    category: 'blue'
  },
  {
    id: 'emotion_blue_despairing',
    title: '절망이에요',
    color: 'rgba(35, 34, 153, 1)',
    category: 'blue'
  },
  // Green emotions
  {
    id: 'emotion_green_calm',
    title: '평온해요',
    color: 'rgba(156, 213, 38, 1)',
    category: 'green'
  },
  {
    id: 'emotion_green_chill',
    title: '차분해요',
    color: 'rgba(126, 193, 36, 1)',
    category: 'green'
  },
  {
    id: 'emotion_green_satisfied',
    title: '만족해요',
    color: 'rgba(102, 177, 35, 1)',
    category: 'green'
  },
  {
    id: 'emotion_green_comfortable',
    title: '편안해요',
    color: 'rgba(35, 166, 38, 1)',
    category: 'green'
  },
  {
    id: 'emotion_green_touched',
    title: '감동이에요',
    color: 'rgba(34, 141, 35, 1)',
    category: 'green'
  }
];

// 현재 emotions 배열의 내용을 확인하고 싶습니다
console.log('Available emotions:', emotions); 