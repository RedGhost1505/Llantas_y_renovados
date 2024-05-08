import { fetchCars } from "@utils";
import { HomeProps } from "@types";
import { fuels, yearsOfProduction } from "@constants";
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero, Carousel, Tyres, Slides } from "@components";

export default async function Home({ searchParams }: HomeProps) {
  const images = [
    { url: "/Slider-tiendas-2.jpg", alt: "image1" },
    { url: "/Slider-tiendas-2-1.jpg", alt: "image2" },
    { url: "/Iguala.jpg", alt: "image3" },
    { url: "/Tezontle.jpg", alt: "image4" },
    { url: "/Valle-dorado.jpg", alt: "image5" },
  ];

  return (
    <main className='overflow-hidden'>
      <Hero />
      <div className='flex mt-16 justify-center items-center'>
        <Carousel />
      </div>
      <div className='flex mt-20 justify-center items-center'>
        <Slides images={images} />
      </div>
      <div className='flex mt-20 mb-10 justify-center items-center'>
        <Tyres />
      </div>
    </main>
  );
}
