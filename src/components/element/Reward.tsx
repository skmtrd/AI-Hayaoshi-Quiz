'use client';

import { useEffect } from 'react';
import { useReward } from 'react-rewards';

type RewardProps = {
  enabled: boolean;
};

export const Reward = ({ enabled }: RewardProps) => {
  const { reward } = useReward('reward', 'confetti', {
    angle: 90,
    decay: 0.9,
    spread: 100,
    startVelocity: 100,
    elementCount: 200,
    lifetime: 2000,
  });

  useEffect(() => {
    if (enabled) {
      reward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return <div id='reward' className='absolute left-1/2 top-2/3 w-full' />;
};
