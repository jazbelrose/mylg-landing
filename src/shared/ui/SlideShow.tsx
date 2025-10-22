import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import { getFileUrl } from '../utils/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './slide-show.css';

interface Slide {
  imageUrl: string;
  title: string;
  content: string;
  url?: string;
}

interface SlideshowProps {
  slides: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ slides }) => {
  return (
    <div className="slideshow-container">
      <Swiper
        modules={[Navigation, Pagination, Mousewheel]}
        navigation
        pagination={{ clickable: true }}
        mousewheel
        spaceBetween={30}
        slidesPerView={1}
      >
        {slides.map((slide, index) => {
          const resolvedImage = getFileUrl(slide.imageUrl);
          const resolvedUrl = slide.url ? getFileUrl(slide.url) : undefined;
          const slideBody = (
            <>
              <img src={resolvedImage} alt={slide.title} />
              <h2>{slide.title}</h2>
              <p>{slide.content}</p>
            </>
          );

          return (
            <SwiperSlide key={index}>
              <div className="slide-content">
                {resolvedUrl ? (
                  <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                    {slideBody}
                  </a>
                ) : (
                  slideBody
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slideshow;









