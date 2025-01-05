"use client";
import React, { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import Cards from './Cards';
import '../styles/Spinner.css'; // Este archivo contendrá los estilos para el spinner

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevenir el comportamiento de envío predeterminado

        const formData = {
            firstName: event.currentTarget.firstName.value,
            lastName: event.currentTarget.lastName.value,
            email: event.currentTarget.email.value,
            mobile: event.currentTarget.mobile.value,
            comments: event.currentTarget.comments.value,
            make: params.make,
            model: params.model,
            year: params.year,
            modification: params.modification_name,
            tire: params.tire,
            rim_diameter: params.rim_diameter,
        };

        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Mensaje enviado correctamente');
                alert('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
            } else {
                console.error('Error al enviar mensaje');
                alert('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Error de conexión al intentar enviar el mensaje.');
        }
    };

    const [data, setData] = useState<Vehicle[]>([]); // Usando el tipo Vehicle[]
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tireData, setTireData] = useState<any[]>([]);
    const [filteredTireData, setFilteredTireData] = useState<any[]>([]);

    const filterTireData = (rim_diameter: string, tire: string) => {
        console.log("Filtering tire data with rim diameter:", rim_diameter, "and tire:", tire);

        // Asegurarse de que el formato de tire sea el correcto, por ejemplo "225/45ZR19"
        const match = tire.match(/([A-Z])(\d{2})$/); // Extraer la construcción y el diámetro

        if (match) {
            const tireParts = tire.split('/'); // Dividir por "/"

            // Asegurarse de que tenemos dos partes después de dividir
            if (tireParts.length === 2) {
                const width = Number(tireParts[0]); // Convertir a número "225"
                const aspect_ratio = Number(tireParts[1].match(/^\d+/)?.[0]); // Convertir a número "45", solo los números antes de las letras
                const diameter = match[2]; // "19"

                console.log("NewDiameter:", diameter);
                console.log("NewWidth:", width);
                console.log("NewAspectRatio:", aspect_ratio);

                if (isNaN(width) || isNaN(aspect_ratio)) {
                    console.error("Invalid width or aspect ratio found.");
                    return null;
                }

                // Definir las tolerancias
                const tolerance = 1; // Tolerancia para el diámetro
                const widthTolerance = 2; // Tolerancia para el ancho
                const aspectRatioTolerance = 2; // Tolerancia para el aspecto

                // Filtrar los datos de tireData usando width, aspect_ratio y diameter
                const filtered = tireData.filter((data) => {
                    const dataWidth = Number(data.width); // Asegurarse de que sea un número
                    const dataAspectRatio = Number(data.aspect_ratio); // Asegurarse de que sea un número
                    const dataDiameter = Number(data.diameter); // Asegurarse de que sea un número
                    const diameterValue = Number(diameter); // Asegurarse de que sea un número

                    // Comparar width, aspect_ratio y diameter con sus respectivas tolerancias
                    return (
                        dataWidth >= width - widthTolerance && dataWidth <= width + widthTolerance &&  // Comparar el ancho del neumático con tolerancia
                        dataAspectRatio >= aspect_ratio - aspectRatioTolerance && dataAspectRatio <= aspect_ratio + aspectRatioTolerance && // Comparar el aspecto del neumático con tolerancia
                        (dataDiameter >= diameterValue - tolerance && dataDiameter <= diameterValue + tolerance) // Comparar diámetro con tolerancia
                    );
                });

                // Actualizar el estado de los datos filtrados
                setFilteredTireData(filtered);

                console.log("Filtered tire data:", filtered);
                return filtered;
            } else {
                console.error("Invalid tire format. Expected format like '225/45ZR19'.");
                return null;
            }
        } else {
            console.error("No valid tire data found.");
            return null;
        }
    };



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

    // Fetch data from API
    useEffect(() => {
        const fetchTireData = async () => {
            try {
                const response = await fetch('/api/db'); // Replace with your API endpoint
                const data = await response.json();
                console.log("Data", data);
                setTireData(data);
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

    return (
        <div className='flex flex-col w-full' >
            <div className="flex items-center justify-center text-6xl font-bold mb-5 text-[#FF6600] italic">
                <span className="inline-block w-20 mr-4 border-t-8 border-[#FF6600]"></span>
                Cotiza ahora
                <span className="inline-block w-20 ml-4 border-t-8 border-[#FF6600]"></span>
            </div>

            <h1 className="text-2xl font-bold text-center text-[#B7B6B6] pt-4">¿Ya tienes tus medidas?</h1>
            <div className="flex justify-center mt-4">
                <input
                    type="text"
                    placeholder="Por ejemplo: 225/45/R17"
                    className="border border-gray-300 rounded-md p-2 w-full max-w-md"
                />
                <button className="bg-[#FF6600] text-white font-semibold rounded-md p-2 ml-2">Buscar</button>
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
                        <button className='bg-[#F8F8FE] text-black text-xl py-2 px-4 rounded-lg font-semibold drop-shadow-lg flex items-center gap-2 mb-4' onClick={() => setParams(prevParams => ({ ...prevParams, rim_diameter: '', tire: '' }))}>
                            <span className='text-4xl'>{params.rim_diameter}</span>
                            <span className='mx-3 h-full self-stretch border-l-2 border-black' style={{ minHeight: '24px' }}></span> {/* Styling line separator */}
                            <span className='text-lg'>{params.tire}</span>
                        </button>
                    </div>
                </>
            )}

            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? (
                <div className="flex items-center justify-center mt-10"> {/* Contenedor centrado */}
                    <div className="spinner"></div>
                </div>
            ) : renderContent()}
        </div>
    );

    function renderContent() {
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
                return renderCards();
            }

            // Puedes agregar más condiciones y renderizados aquí
        } else {
            return <p>No data found</p>;
        }
    }

    function renderForm() {
        return (
            <div className='flex flex-col justify-center items-center overflow-y-auto max-h-[600px] w-full px-5 mt-5'>
                <div className='flex flex-wrap justify-center gap-5'>
                    <text className='text-2xl font-bold text-center text-[#B7B6B6]'>Nos pondremos en contacto</text>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 w-full mt-5 max-w-md bg-[#F8F8FE] py-2 px-4 rounded-lg">
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
                        <textarea id="comments" name="comments" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Cotiza</button>
                    </div>
                </form>
            </div>
        );
    }

    function renderCards() {
        return (
            <Cards rim_diameter={params.rim_diameter} tire={params.tire} tireData={filteredTireData} />
        );
    }
}

export default Tyres;
