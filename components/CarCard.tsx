"use client";

import { useState } from "react";
import Image from "next/image";

import CustomButton from "./CustomButton";
import CarDetails from "./CarDetails";

// Define a new interface for our tire data
interface TireCardProps {
  tire: {
    Marca: string;
    Modelo: string;
    Width: string;
    Aspect_Ratio: string;
    Diameter: string;
    Fuente_Imagen: string;
    [key: string]: any; // Allow other properties
  };
}

const CarCard = ({ tire }: TireCardProps) => {
  const { Marca, Modelo, Width, Aspect_Ratio, Diameter, Fuente_Imagen } = tire;

  const [isOpen, setIsOpen] = useState(false);

  // Construct the image path
  const imageUrl = Fuente_Imagen ? `/tires/${Fuente_Imagen}` : '/car-logo.png';

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {Marca} {Modelo}
        </h2>
      </div>

      <p className='flex mt-6 text-[22px] leading-[26px] font-bold'>
        {Width}/{Aspect_Ratio || 'N/A'}R{Diameter}
      </p>

      <div className='relative w-full h-40 my-3 object-contain'>
        <Image src={imageUrl} alt={`${Marca} ${Modelo}`} fill priority className='object-contain' />
      </div>

      <div className='relative flex w-full mt-2'>
        <div className="car-card__btn-container">
          <CustomButton
            title='Ver Detalles'
            containerStyles='w-full py-[16px] rounded-full bg-[#FF6600]'
            textStyles='text-white text-[14px] leading-[17px] font-bold'
            rightIcon='/right-arrow.svg'
            handleClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} tire={tire} />
    </div>
  );
};

export default CarCard;
