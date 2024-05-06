"use client";
import Image from "next/image";
import Button from './CustomButton';
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Carousel = () => {
    return (
        <div className='flex flex-col' >
            <Image
                src="/Cotiza.png"
                alt="hero"
                width={800}
                height={800}
                className="object-contain"
            />
            <button className='bg-[#FF6600] text-white text-xl py-2 px-4 rounded-lg'>Cotiza aquí</button>

            <div className='flex justify-center items-center gap-5 mt-10'>
                <text className='text-black text-2xl font-bold '>Nuestras Marcas</text>
            </div>

        </div>
    )
}

export default Carousel