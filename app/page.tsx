import { fetchCars } from "@utils";
import { HomeProps } from "@types";
import { fuels, yearsOfProduction } from "@constants";
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero, Carousel, Tyres, Slides } from "@components";

export default async function Home({ searchParams }: HomeProps) {
  const images = [
    { url: "/Slider-tiendas-2.jpg", alt: "image1", ub: "Sucursal Valsequillo", loc: "José María La Fragua No. 10537- Esq. 24 sur y Valsequillo\n Col. Rancho San José Xilotzingo, PUEBLA PUE." },
    { url: "/Slider-tiendas-2-1.jpg", alt: "image2", ub: "Sucursal Boulevard Chilpancingo", loc: "BLVD.Vicente Guerreo KM.271 COL. Cuauhtemoc Norte\n CHILPANCINGO DE LOS BRAVO GUERRERO" },
    { url: "/Iguala.jpg", alt: "image3", ub: "Sucursal Bandera Iguala", loc: "Av. Bandera Nacional No.75 Col. Centro, IGUALA DE LA INDEPENDENCIA, GRO." },
    { url: "/Tezontle.jpg", alt: "image4", ub: "Sucursal Tezontle ", loc: "Av. Tezontle No.53 Col. Paseos de Churubusco , ALCALDIA IZTAPALAPA CDMX." },
    { url: "/Valle-dorado.jpg", alt: "image5", ub: "Sucursal Valle Dorado", loc: "Paseo de las Aves 5 Valle Dorado, Roblespatera54020 Tlalnepantla de Baz, Méx." },
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
