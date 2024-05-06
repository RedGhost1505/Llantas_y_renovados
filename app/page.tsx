import { fetchCars } from "@utils";
import { HomeProps } from "@types";
import { fuels, yearsOfProduction } from "@constants";
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero, Carousel, Tyres } from "@components";

export default async function Home({ searchParams }: HomeProps) {
  // const allCars = await fetchCars({
  //   manufacturer: searchParams.manufacturer || "",
  //   year: searchParams.year || 2022,
  //   fuel: searchParams.fuel || "",
  //   limit: searchParams.limit || 10,
  //   model: searchParams.model || "",
  // });

  // const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className='overflow-hidden'>
      <Hero />
      <div className='flex mt-16 justify-center items-center'>
        <Carousel />
      </div>
      <div className='flex mt-20 mb-10 justify-center items-center'>
        <Tyres />
      </div>
    </main>
  );
}
