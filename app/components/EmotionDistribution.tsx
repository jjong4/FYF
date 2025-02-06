interface EmotionDistributionProps {
  emotions: string[];  // emotion ids
}

export default function EmotionDistribution({ emotions }: EmotionDistributionProps) {
  const calculateDistribution = (emotionIds: string[]) => {
    const total = emotionIds.length;
    const positiveCount = emotionIds.filter(id => 
      id.startsWith('emotion_green_') || id.startsWith('emotion_yellow_')
    ).length;
    const negativeCount = total - positiveCount;

    const positivePercent = Math.round((positiveCount / total) * 100);
    const negativePercent = Math.round((negativeCount / total) * 100);

    return `긍정 ${positivePercent}% / 부정 ${negativePercent}%`;
  };

  return (
    <div className="text-xs text-gray-600">
      {calculateDistribution(emotions)}
    </div>
  );
} 