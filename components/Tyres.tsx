"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Tyres = () => {
    // Estado para almacenar parámetros de búsqueda
    const [params, setParams] = useState({
        make: '',
        model: '',
        modification: '',
        year: '',
        tire: '',
        rim_diameter: '',
        user_key: process.env.NEXT_PUBLIC_API_KEY,
    });

    const [data, setData] = useState([]); // Estado para almacenar los datos de la API [opcional]
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Función para realizar la solicitud GET a la API
    const fetchData = async () => {
        // Construir la URL base de la API
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
            return; // No need to fetch data, we have all the required parameters
        }

        try {
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log(data.data); // Procesar los datos como sea necesario
            setData(data.data); // Actualizar el estado con los datos de la API
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para ejecutar fetchData cuando el componente se monte
    useEffect(() => {
        fetchData();
        console.log("Updated params:", params); // Log para verificar los parámetros actualizados
    }, [params]); // Dependencias en el arreglo para reaccionar a cambios en los parámetros


    const handleClick = (make: string) => {
        setParams(prevParams => ({
            ...prevParams,
            make: make,
            model: '',  // Restablecer model, year y modification cuando se cambia make
            year: '',
            modification: '',
            tire: '',
            rim_diameter: '',
        }));
    };

    return (
        <div className='flex flex-col w-full' >
            <div className="flex items-center justify-center text-6xl font-bold mb-10 text-[#FF6600] italic">
                <span className="inline-block w-20 mr-4 border-t-8 border-[#FF6600]"></span>
                Cotiza ahora
                <span className="inline-block w-20 ml-4 border-t-8 border-[#FF6600]"></span>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? <p>Loading...</p> : renderContent()}
        </div>
    );

    function renderContent() {
        if (data.length > 0) {
            if (!params.make) {
                return (
                    <div className='overflow-y-auto max-h-[500px] w-full px-5'>
                        <div className='flex flex-wrap justify-center gap-5 mt-10'>
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => handleClick(item.slug)}>
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
                            {data.map((item) => (
                                <button key={item.id} className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg italic font-bold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, modification: item.slug }))}>
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
                            {data.map((item) => {
                                if (!item.wheels) return null; // No wheels data, provide fallback or null
                                return item.wheels.map((wheel, index) => {
                                    const frontWheel = wheel.front;
                                    if (!frontWheel) return null; // No front wheel data, skip this iteration

                                    return (
                                        <button
                                            key={`${item.id}-${index}`}
                                            className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg font-semibold drop-shadow-lg flex items-center gap-2 mb-4'
                                            onClick={() => setParams(prevParams => ({
                                                ...prevParams,
                                                rim_diameter: frontWheel.rim_diameter,
                                                tire: frontWheel.tire,
                                            }))
                                            }
                                        >
                                            <span className='text-4xl'>{frontWheel.rim_diameter}</span>
                                            <span className='mx-3 h-full self-stretch border-l-2 border-black' style={{ minHeight: '24px' }}></span> {/* Styling line separator */}
                                            <span className='text-lg'>{frontWheel.tire}</span>
                                        </button>
                                    );
                                });
                            })}
                        </div>
                    </div>
                );
            }
            else if (params.make && params.model && params.year && params.modification && params.rim_diameter && params.tire) {
                return renderForm();
            }

            // Puedes agregar más condiciones y renderizados aquí
        } else {
            return <p>No data found</p>;
        }
    }

    function renderForm() {
        return (
            <div className='flex justify-center items-center overflow-y-auto max-h-[600px] w-full px-5'>
                <form className="space-y-6 w-full max-w-md bg-[#F8F8FE] py-2 px-4 rounded-lg">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombres</label>
                        <input type="text" id="firstName" name="firstName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                        <input type="text" id="lastName" name="lastName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Número</label>
                        <input type="tel" id="mobile" name="mobile" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Especificaciones Adicionales</label>
                        <textarea id="comments" name="comments" rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Cotiza</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Tyres;
