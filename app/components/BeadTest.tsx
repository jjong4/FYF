'use client';

import Bead from './Bead';

export default function BeadTest() {
  const handleBeadClick = () => {
    console.log('구슬 클릭됨');
  };

  return (
    <div className="p-8 flex gap-4">
      <Bead 
        color="rgb(255, 0, 0)" 
        onClick={handleBeadClick}
      />
      <Bead 
        color="rgb(191, 255, 0)" 
        onClick={handleBeadClick}
      />
      <Bead 
        color="rgb(0, 255, 0)" 
        onClick={handleBeadClick}
      />
      <Bead 
        color="rgb(0, 0, 255)" 
        onClick={handleBeadClick}
      />
    </div>
  );
} 