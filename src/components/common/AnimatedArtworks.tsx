import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

type animateData={
    animationData:object;
}

const AnimatedArtwork: React.FC<animateData> = ({animationData}) => {
  return (
    <div className='w-12 h-12'>
      <Player
        autoplay
        loop
        src={animationData}
        style={{ height: '20rem', width: '20rem',position:'static' }}
      />
    </div>
  );
};

export default AnimatedArtwork;
