'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import favicon from "../public/favicon1.png"

// Importa estilos necesarios
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';

// Registra los módulos en SwiperCore
SwiperCore.use([Autoplay, Pagination, Navigation]);

// Definición de la interfaz para los elementos de imagen
interface ImageItem {
    url: string;
    alt: string;
    ub: string;
    loc: string;
}

// Props del componente Carousel
interface CarouselProps {
    images: ImageItem[];
}

const handleSearchClick = (searchQuery: string): void => {
    const encodedQuery = encodeURIComponent(searchQuery);
    window.open(`https://www.google.com/search?q=Llantas y Renovado ${encodedQuery}`, '_blank');
};

const Slides: React.FC<CarouselProps> = ({ images }) => {
    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    600: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    }
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-[50vh]">
                            <img src={image.url} alt={image.alt} className="absolute w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80">
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                                    <img src="/favicon1.png" className="w-20" />
                                    <h2 className="text-3xl font-bold">{image.ub}</h2>
                                    {/* Render image.loc with line breaks and make it clickable */}
                                    <div className="text-md text-center" style={{ cursor: 'pointer' }}>
                                        {image.loc.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                <span onClick={() => handleSearchClick(line)}>{line}</span><br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slides;
