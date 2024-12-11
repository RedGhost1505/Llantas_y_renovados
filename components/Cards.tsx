import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import tyre from '../public/goodyear-assurance-fuel-max.jpg';

interface CardProps {
    rim_diameter: string;  // Adjust the type based on your needs
    tire: string;          // Adjust the type based on your needs
}

const Cards: React.FC<CardProps> = ({ rim_diameter, tire }) => {

    const rimDiameter = rim_diameter;
    const construction = tire;

    console.log("Rim Diameter:", rimDiameter);
    console.log("Construction:", construction);

    const [tireData, setTireData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from API
    useEffect(() => {
        const fetchTireData = async () => {
            try {
                const response = await fetch('/api/db'); // Replace with your API endpoint
                const data = await response.json();
                console.log("Data", data);
                setTireData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchTireData();
    }, []);

    // Loading or error state
    if (loading) return (
        <div className="flex items-center justify-center mt-10"> {/* Contenedor centrado */}
            <div className="spinner"></div>
        </div>
    );
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center mt-10">
            <div className='flex justify-center mt-10 mb-4'>
                <p className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona una de nuestras llantas</p>
            </div>

            <div className='flex flex-wrap justify-center'>
                {/* Loop through tireData and display each tire */}
                {tireData.map((tire, index) => (
                    <div key={tire.codigo} className="flex justify-center w-full md:w-1/2 lg:w-1/3 py-4 px-0">
                        <div className="bg-[#F8F8FE] drop-shadow-lg rounded-lg p-6 max-w-md w-[350px]">
                            <div className="flex justify-center">
                                <div className="w-[200px] h-[200px]"> {/* Fixed size container */}
                                    <Image
                                        src={tire.fuente_imagen}
                                        alt="tyre"
                                        className="rounded-lg object-cover w-full h-full" // Ensures all images are scaled to fit
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            </div>
                            <p className="col-span-2 mt-8 font-bold text-xl">
                                {tire.modelo}
                                <span className='font-normal text-sm'> - {tire.marca} </span>
                            </p>
                            <p className='mt-1'>
                                {(tire.width || "-")}/{(tire.aspect_ratio || "-")}/{(tire.construction || "-")}{(tire.diameter || "-")} - {(tire.rango_carga || "-")}{(tire.rango_velocidad || "-")}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <p className="col-span-1"><strong>Capas:</strong> {tire.capas}</p>
                                <p className="col-span-1"><strong>Uso:</strong> {tire.uso}</p>
                                <p className="col-span-1 text-green-500 flex items-center">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    <strong>Disponible</strong>
                                </p>
                            </div>
                            <div className='w-full flex flex-row justify-between items-center mt-8'>
                                <p className="col-span-2 font-bold text-xl text-red-500">MX ${tire.may}</p>
                                <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Cards;
