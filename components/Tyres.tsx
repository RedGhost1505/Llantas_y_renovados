"use client";
import React, { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import Cards from './Cards';
import '../styles/Spinner.css'; // Este archivo contendrá los estilos para el spinner
import InputMask from 'react-input-mask';
import { render } from '@node_modules/@headlessui/react/dist/utils/render';
import { Toaster, toast } from 'sonner';

interface WheelDetails {
    rim_diameter: string;
    tire: string;
}

interface Wheel {
    front?: WheelDetails;
    rear?: WheelDetails;
}

interface Vehicle {
    id: string;
    name: string;
    slug: string;
    logo: string;
    wheels?: Wheel[];
}

const Tyres = () => {
    // Estado para almacenar parámetros de búsqueda
    const [params, setParams] = useState({
        make: '',
        model: '',
        modification: '',
        modification_name: '',
        year: '',
        tire: '',
        rim_diameter: '',
        logo: '',
        user_key: process.env.NEXT_PUBLIC_API_KEY,
    });


    const [data, setData] = useState<Vehicle[]>([]); // Usando el tipo Vehicle[]
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tireData, setTireData] = useState<any[]>([]);
    const [filteredTireData, setFilteredTireData] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [unit, setUnit] = useState('mm'); // 'mm' or 'in'

    const filterTireData = (rim_diameter: string, tire?: string) => {
        console.log(`Filtering with (${unit}):`, tire || rim_diameter);

        let searchDiameter: number;
        let searchWidth: number | null = null;
        let searchAspectRatio: number | null = null;

        if (unit === 'mm' && tire) {
            const match = tire.match(/^(\d{3})\/(\d{2})[A-Z]*R(\d{2,3}(?:[.,]\d)?)$/);
            if (!match) {
                console.error("Invalid metric tire format for filtering. Received:", tire);
                return null;
            }
            searchWidth = Number(match[1]);
            searchAspectRatio = Number(match[2]);
            searchDiameter = Number(String(match[3]).replace(',', '.'));
        } else { // unit === 'in'
            if (tire) { // Full imperial format e.g., 31x10.50R15
                const match = tire.match(/^(\d{2}(?:[.,]\d)?)[xX](\d{2}(?:[.,]\d)?)[A-Z]*R(\d{2,3}(?:[.,]\d)?)$/);
                if (!match) {
                    console.error("Invalid imperial tire format for filtering. Received:", tire);
                    searchDiameter = Number(String(rim_diameter).replace(',', '.'));
                } else {
                    searchWidth = Number(String(match[2]).replace(',', '.')) * 25.4; // Convert width to mm
                    searchAspectRatio = null;
                    searchDiameter = Number(String(match[3]).replace(',', '.'));
                }
            } else { // Only diameter
                searchDiameter = Number(String(rim_diameter).replace(',', '.'));
            }
        }

        const diameterTolerance = 0.5; // Allow +/- 0.5 inch for diameter

        const filtered = tireData.filter((data) => {
            const dataDiameter = Number(String(data.Diameter).replace(',', '.'));
            const isDiameterMatch = Math.abs(dataDiameter - searchDiameter) <= diameterTolerance;

            if (unit === 'mm' && searchWidth && searchAspectRatio) {
                const widthTolerance = 10; // Allow +/- 10mm for width
                const aspectRatioTolerance = 5; // Allow +/- 5 for aspect ratio
                const dataWidth = Number(data.Width);
                const dbWidthInMm = dataWidth < 30 ? dataWidth * 25.4 : dataWidth;
                const dataAspectRatio = Number(data.AspectRatio);
                const isWidthMatch = Math.abs(dbWidthInMm - searchWidth) <= widthTolerance;
                const isAspectRatioMatch = !data.Aspect_Ratio || Math.abs(dataAspectRatio - searchAspectRatio) <= aspectRatioTolerance;
                return isDiameterMatch;
            } else if (unit === 'in' && searchWidth) {
                const widthTolerance = 10;
                const dataWidth = Number(data.Width);
                const dbWidthInMm = dataWidth < 30 ? dataWidth * 25.4 : dataWidth;
                const isWidthMatch = Math.abs(dbWidthInMm - searchWidth) <= widthTolerance * 1.5; // Looser tolerance for inches
                return isDiameterMatch && isWidthMatch;
            }
            return isDiameterMatch;
        });

        setFilteredTireData(filtered);
        console.log("Filtered Results:", filtered);
        return filtered;
    };




    // Función para realizar la solicitud GET a la API
    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        let baseUrl = `https://api.wheel-size.com/v2/makes/?user_key=${params.user_key}`;

        if (params.make && !params.model) {
            baseUrl = `https://api.wheel-size.com/v2/models/?make=${params.make}&user_key=${params.user_key}`;
        } else if (params.make && params.model && !params.year) {
            baseUrl = `https://api.wheel-size.com/v2/years/?make=${params.make}&model=${params.model}&user_key=${params.user_key}`;
        } else if (params.make && params.model && params.year && !params.modification) {
            baseUrl = `https://api.wheel-size.com/v2/modifications/?make=${params.make}&model=${params.model}&year=${params.year}&user_key=${params.user_key}`;
        } else if (params.make && params.model && params.year && params.modification) {
            baseUrl = `https://api.wheel-size.com/v2/search/by_model/?make=${params.make}&model=${params.model}&modification=${params.modification}&year=${params.year}&user_key=${params.user_key}`;
        } else if (params.make && params.model && params.year && params.modification && params.rim_diameter && params.tire) {
            return;
        }

        try {
            const response = await fetch(baseUrl);
            if (response.status === 429) {
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            setData(data.data);
        } catch (error) {
            console.error('Fetch error:', error);
            if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
                setError('Selección temporalmente desactivada');
            } else {
                setError('Error al cargar los datos');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para ejecutar fetchData cuando el componente se monte
    useEffect(() => {
        fetchData();
        console.log("Updated params:", params); // Log para verificar los parámetros actualizados
    }, [params]); // Dependencias en el arreglo para reaccionar a cambios en los parámetros

    // Fetch data from API
    useEffect(() => {
        const fetchTireData = async () => {
            try {
                const response = await fetch('/api/products'); // 1. Use the new API endpoint
                const data = await response.json();
                console.log("Data from /api/products", data.productos);
                setTireData(data.productos); // 2. Access the 'productos' array
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
            }
        };

        fetchTireData();
    }, []);


    const handleClick = (make: string, logo: string) => {
        setParams(prevParams => ({
            ...prevParams,
            make: make,
            model: '',  // Restablecer model, year y modification cuando se cambia make
            year: '',
            modification: '',
            modification_name: '',
            tire: '',
            rim_diameter: '',
            logo: logo,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        let isComplete = false;
        if (unit === 'mm') {
            isComplete = /^(\d{3})\/(\d{2})\/R(\d{2})$/.test(value);
        } else { // unit === 'in'
            isComplete = value.trim() !== '';
        }
        setIsButtonDisabled(!isComplete);
    };

    const handleSearchClick = () => {
        // Limpiar todos los params al buscar por input
        setParams(prevParams => ({
            ...prevParams,
            make: '',
            model: '',
            year: '',
            modification: '',
            modification_name: '',
            tire: '',
            rim_diameter: '',
            logo: ''
        }));

        const rimDiameterMatch = inputValue.match(/R(\d{2,3}(?:[.,]\d)?)$/);
        const cleanRimDiameter = rimDiameterMatch ? rimDiameterMatch[1] : '';
        const results = filterTireData(cleanRimDiameter, inputValue);

        // Mostrar toast si no hay resultados
        if (!results || results.length === 0) {
            toast.error('No se encontraron resultados', {
                description: 'Por favor, intenta con otras medidas o usa el buscador por vehículo.',
            });
        }
    };

    const handleUnitToggle = () => {
        setUnit(prevUnit => {
            const newUnit = prevUnit === 'mm' ? 'in' : 'mm';
            setInputValue(''); // Clear input when toggling
            setIsButtonDisabled(true); // Disable button
            return newUnit;
        });
    };


    return (
        <div className='flex flex-col w-full' >
            <Toaster position="bottom-right" richColors />
            <div className="flex items-center justify-center text-6xl font-bold mb-5 text-[#FF6600] italic">
                <span className="inline-block w-20 mr-4 border-t-8 border-[#FF6600]"></span>
                Cotiza ahora
                <span className="inline-block w-20 ml-4 border-t-8 border-[#FF6600]"></span>
            </div>

            <h1 className="text-2xl font-bold text-center text-[#B7B6B6] pt-4">¿Ya tienes tus medidas?</h1>
            <div className="flex justify-center mt-4">
                <InputMask
                    mask={unit === 'mm' ? "999/99/R99" : "R99"}
                    placeholder={unit === 'mm' ? "Por ejemplo: 225/45/R17" : "Por ejemplo: R15"}
                    className="border-t border-b border-l border-gray-300 rounded-l-full p-4 w-full max-w-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all duration-300 placeholder-gray-400 text-lg"
                    value={inputValue} // El valor del input es el valor del estado
                    onChange={handleInputChange} // Se ejecuta cuando el usuario escribe
                />
                <button
                    onClick={handleUnitToggle}
                    className="bg-gray-200 text-gray-700 font-semibold p-4 border-t border-b border-gray-300 hover:bg-gray-300 transition-colors"
                >
                    {unit.toUpperCase()}
                </button>
                <button
                    className={`bg-[#FF6600] text-white font-semibold rounded-r-full p-4 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSearchClick}
                    disabled={isButtonDisabled} // Deshabilita el botón si el input no está completo
                >
                    Buscar
                </button>
            </div>
            <h1 className="text-2xl font-bold text-center text-[#B7B6B6] pt-4 pb-4">o</h1>

            {params.make && !params.model && (
                <>
                    <div className='flex justify-center gap-5 mt-10'>
                        {/* Al dar click limpia los datos de make y logo */}
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, make: '', logo: '' }))}>
                            <Image src={params.logo || '/default-logo.png'} alt={params.make} width={50} height={50} className='object-contain' />
                            {params.make}
                        </button>
                    </div>
                </>
            )}

            {params.make && params.model && !params.year && (
                <>
                    <div className='flex justify-center gap-5 mt-10'>
                        {/* Al dar click limpia los datos de model */}
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            <Image src={params.logo || '/default-logo.png'} alt={params.make} width={50} height={50} className='object-contain' />
                            {params.make}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, model: '' }))}>
                            {params.model}
                        </button>
                    </div>
                </>
            )}

            {params.make && params.model && params.year && !params.modification && (
                <>
                    <div className='flex justify-center gap-5 mt-10'>
                        {/* Al dar click limpia los datos de year */}
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            <Image src={params.logo || '/default-logo.png'} alt={params.make} width={50} height={50} className='object-contain' />
                            {params.make}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.model}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, year: '' }))}>
                            {params.year}
                        </button>
                    </div>
                </>
            )}

            {params.make && params.model && params.year && params.modification && !params.rim_diameter && !params.tire && (
                <>
                    <div className='flex justify-center gap-5 mt-10'>
                        {/* Al dar click limpia los datos de modification */}
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            <Image src={params.logo || '/default-logo.png'} alt={params.make} width={50} height={50} className='object-contain' />
                            {params.make}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.model}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.year}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, modification: '' }))}>
                            {params.modification_name}
                        </button>
                    </div>
                </>
            )}

            {params.make && params.model && params.year && params.modification && params.rim_diameter && params.tire && (
                <>
                    <div className='flex justify-center gap-5 mt-10'>
                        {/* Al dar click limpia los datos de rim_diameter y tire */}
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            <Image src={params.logo || '/default-logo.png'} alt={params.make} width={50} height={50} className='object-contain' />
                            {params.make}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.model}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.year}
                        </button>
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' disabled>
                            {params.modification_name}
                        </button>
                        <button
                            className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg font-semibold drop-shadow-lg flex items-center gap-2 mb-4'
                            onClick={() => {
                                setParams(prevParams => ({ ...prevParams, rim_diameter: '', tire: '' }));
                                setFilteredTireData([]);
                            }}
                        >
                            <span className='text-4xl'>{params.rim_diameter}</span>
                            <span className='mx-3 h-full self-stretch border-l-2 border-black' style={{ minHeight: '24px' }}></span>
                            <span className='text-lg'>{params.tire}</span>
                        </button>
                    </div>
                </>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center mt-10"> {/* Contenedor centrado */}
                    <div className="spinner"></div>
                </div>
            ) : renderContent()}
        </div>
    );

    function renderContent() {

        if (filteredTireData.length > 0) {
            return <Cards tireData={filteredTireData} />;
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center w-full h-36">
                    <p className="text-4xl font-bold text-[#FF6600] text-center">
                        {error}
                    </p>
                    <p className="text-2xl font-bold mt-2 text-[#B7B6B6] text-center">
                        Porfavor, usa el buscador de arriba.
                    </p>
                </div>
            );
        }

        if (data.length > 0) {
            if (!params.make) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona la marca de tu vehículo</text>
                        </div>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => handleClick(item.slug, item.logo)}>
                                    <Image src={item.logo || '/default-logo.png'} alt={item.name} width={50} height={50} className='object-contain' />
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (params.make && !params.model) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona el modelo de tu vehículo</text>
                        </div>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, model: item.slug }))}>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (params.make && params.model && !params.year) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona el año de tu vehículo</text>
                        </div>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, year: item.name }))}>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (params.make && params.model && params.year && !params.modification) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona la modificación de tu vehículo</text>
                        </div>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, modification: item.slug, modification_name: item.name }))}>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (params.make && params.model && params.year && params.modification && !params.rim_diameter && !params.tire) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona el tamaño de tus llantas</text>
                        </div>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => {
                                return item.wheels?.map((wheel, index) => {
                                    if (!wheel.front) {
                                        return null;  // Skip rendering this button if no front wheel data is available.
                                    }
                                    return (
                                        <button
                                            key={`${item.id}-${index}`}
                                            className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg font-semibold drop-shadow-lg flex items-back gap-2 mb-4'
                                            onClick={() => {
                                                if (wheel.front) {  // Direct check inside the handler
                                                    setParams(prevParams => ({
                                                        ...prevParams,
                                                        rim_diameter: wheel.front?.rim_diameter || '',
                                                        tire: wheel.front?.tire || '',
                                                    }));
                                                    filterTireData(wheel.front?.rim_diameter || '', wheel.front?.tire || '');
                                                }
                                            }}
                                        >
                                            <span className='text-4xl'>{wheel.front?.rim_diameter}</span>
                                            <span className='mx-3 h-full self-stretch border-l-2 border-black' style={{ minHeight: '24px' }}></span>
                                            <span className='text-lg'>{wheel.front?.tire}</span>
                                        </button>
                                    );
                                });
                            })}
                        </div>
                    </div>
                );
            }
            else if (params.make && params.model && params.year && params.modification && params.rim_diameter && params.tire) {
                return <Cards tireData={filteredTireData} />;
            }
        } else if (filteredTireData.length > 0) {
            // Si no hay datos de marcas pero sí hay datos filtrados, mostrar las Cards
            return <Cards tireData={filteredTireData} />;
        } else {
            return <p>No data found</p>;
        }
    }
}

export default Tyres;