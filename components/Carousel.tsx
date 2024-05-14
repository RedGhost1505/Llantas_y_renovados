"use client";
import Image from "next/image";
import React, { useRef, useState } from 'react';


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
                <span className='w-10 h-1 bg-[#000000]'></span>
                <text className='text-black text-2xl font-bold '>Nuestras sucursales</text>
                <span className='w-10 h-1 bg-[#000000]'></span>
            </div>

        </div>
    )
}

export default Carousel