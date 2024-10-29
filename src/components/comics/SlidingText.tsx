import Star from "@/assets/imgs/star.png";
import React from "react";
import { Link } from "react-router-dom";

const SlidingText: React.FC = () => {
  return (
    <div className='marquee'>
      <span className='marquee1'>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <Link to='/comic-workshop'>
          <span className='text cursor-pointer'>
            Comic making Workshop
            <img className='w-[15%]' src={Star} alt='star' />
          </span>
        </Link>
        <span className='marquee2'>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
          <Link to='/comic-workshop'>
            <span className='text cursor-pointer'>
              Comic making Workshop
              <img className='w-[15%]' src={Star} alt='star' />
            </span>
          </Link>
        </span>
      </span>
    </div>
  );
};

export default SlidingText;
