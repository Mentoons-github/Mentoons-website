import React from 'react';
import { BsPersonArmsUp } from 'react-icons/bs';

type HeadingProps = {
  heading: string;
};

const Heading: React.FC<HeadingProps> = ({ heading }) => {
  return (
    <div className='relative bg-light-cyan mx-auto mb-20 px-12 py-8 md:px-24 lg:px-32 lg:py-10 rounded-[100%] w-[90%] max-w-xs md:max-w-md lg:max-w-lg' style={{
      boxShadow: '6px 6px 0px rgba(255, 0, 0, 0.2)'
    }}>
      <div className='flex gap-3 lg:gap-5 absolute left-1/2 transform -translate-x-1/2 top-[-20px] md:top-[-25px] lg:top-[-31px]'>
        <i className='text-2xl md:text-3xl lg:text-4xl text-mustard'><BsPersonArmsUp /></i>
        <i className='text-2xl md:text-3xl lg:text-4xl text-mustard'><BsPersonArmsUp /></i>
      </div>
      <div className='text-white text-xl md:text-2xl lg:text-3xl font-extrabold text-center'>
        <h1 className='lg:whitespace-nowrap'>{heading}</h1>
      </div>
    </div>
  );
};

export default Heading;
