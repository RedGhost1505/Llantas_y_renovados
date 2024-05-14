import Link from "next/link";
import Image from "next/image";

import CustomButton from "./CustomButton";

const NavBar = () => (
  <header className='w-full  absolute z-10'>
    <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent'>
      <Link href='/' className='flex justify-center items-center'>
        <Image
          src='/Logo.png'
          alt='logo'
          width={300}
          height={10}
          className='object-contain'
        />
      </Link>

      <div className="flex gap-10">
        <Link href='https://www.facebook.com/people/Llantas-Y-Renovado-General-Asociados/61556635631140/?locale=es_LA' className='flex justify-center items-center'>
          <Image
            src='/facebook.svg'
            alt='search'
            width={30}
            height={20}
            className='object-contain'
          />
        </Link>
        <Link href='https://www.instagram.com/llantasyrenovado/' className='flex justify-center items-center'>
          <Image
            src='/instagram.svg'
            alt='search'
            width={30}
            height={20}
            className='object-contain'
          />
        </Link>
        <Link href='https://api.whatsapp.com/send/?phone=5212227237935&text&type=phone_number&app_absent=0' className='flex justify-center items-center'>
          <Image
            src='whatsapp.svg'
            alt='search'
            width={30}
            height={20}
            className='object-contain'
          />
        </Link>
      </div>
    </nav>
  </header>
);

export default NavBar;
