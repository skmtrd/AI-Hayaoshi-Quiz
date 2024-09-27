import { forwardRef, useState } from 'react';

interface BuzzerButtonProps {
  onClick: () => void;
  isPressed: boolean;
}

function BuzzerButton({ onClick, isPressed }: BuzzerButtonProps) {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <button onClick={onClick} className='w-full focus:outline-none' aria-pressed={isPressed}>
        <svg
          viewBox='0 0 100 100'
          className='mx-auto h-auto w-4/5'
          xmlns='http://www.w3.org/2000/svg'
        >
          <ellipse cx='50' cy='65' rx='45' ry='20' fill='#ffdac3' />
          <ellipse cx='50' cy='62' rx='45' ry='20' fill='#ffdac3' />
          <ellipse cx='50' cy='59' rx='45' ry='20' fill='#ffdac3' />

          <g className='transition-all' transform={isPressed ? 'translate(0, 3)' : ''}>
            <ellipse cx='50' cy='52' rx='35' ry='17' fill='#FF5722' />
            <ellipse cx='50' cy='50' rx='35' ry='17' fill='#FF7043' />
          </g>
        </svg>
      </button>
    </div>
  );
}

interface InteractiveBuzzerButtonProps {
  onClick: () => void;
}

const InteractiveBuzzerButton = forwardRef<HTMLDivElement, InteractiveBuzzerButtonProps>(
  function InteractiveBuzzerButton({ onClick }, ref) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200); // Reset after 200ms
    };

    return (
      <div ref={ref} onClick={onClick} className='p-4'>
        <BuzzerButton onClick={handleClick} isPressed={isPressed} />
      </div>
    );
  },
);

export default InteractiveBuzzerButton;
