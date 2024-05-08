'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';

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
}

// Props del componente Carousel
interface CarouselProps {
    images: ImageItem[];
}

const Slides: React.FC<CarouselProps> = ({ images }) => {
    return (
        <div style={{ width: '50%', overflow: 'hidden' }}>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{
                    delay: 200,
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
                        <img src={image.url} alt={image.alt} style={{ width: '100%', height: '50vh', objectFit: 'cover' }} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slides;
