import React, { useState } from 'react';
import Image from 'next/image';

interface CardProps {
    rim_diameter: string;
    tire: string;
    tireData: any[];
}

const Cards: React.FC<CardProps> = ({ rim_diameter, tire, tireData }) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

    const handleAddClick = (tireId: string) => {
        setSelectedItems(prev => ({ ...prev, [tireId]: 1 }));
    };

    const handleIncrease = (tireId: string) => {
        setSelectedItems(prev => ({ ...prev, [tireId]: (prev[tireId] || 1) + 1 }));
    };

    const handleDecrease = (tireId: string) => {
        setSelectedItems(prev => {
            const newCount = (prev[tireId] || 1) - 1;
            if (newCount <= 0) {
                const { [tireId]: _, ...rest } = prev; // Remove the item if count is 0 or less
                return rest;
            }
            return { ...prev, [tireId]: newCount };
        });
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className='flex justify-center mt-10 mb-4'>
                <p className='text-2xl font-bold text-center text-[#B7B6B6]'>Selecciona una de nuestras llantas</p>
            </div>

            <div className='flex flex-wrap justify-center'>
                {tireData.map((tire) => (
                    <div key={tire.codigo} className="flex justify-center w-full md:w-1/2 lg:w-1/4 py-4 px-0">
                        <div className="bg-[#F8F8FE] drop-shadow-lg rounded-lg p-6 max-w-md w-[350px]">
                            <div className="flex justify-center">
                                <div className="w-[200px] h-[200px]">
                                    <Image
                                        src={tire.fuente_imagen}
                                        alt="tyre"
                                        className="rounded-lg object-cover w-full h-full"
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
                                <p className="col-span-1"><strong>Modelo:</strong> {tire.modelo}</p>
                                <p className="col-span-1"><strong>Uso:</strong> {tire.uso}</p>
                                <p className="col-span-1 text-green-500 flex items-center">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    <strong>Disponible</strong>
                                </p>
                            </div>

                            <div className='w-full flex flex-row justify-between items-center mt-8'>
                                <p className="col-span-2 font-bold text-xl text-red-500">MX ${tire.may}</p>

                                {/* Condicional para mostrar el botón o el control de cantidad */}
                                {selectedItems[tire.codigo] ? (
                                    <div className="flex items-center">
                                        <button
                                            className="bg-gray-300 text-black font-bold py-1 px-3 rounded-l-full hover:bg-gray-400 transition duration-300"
                                            onClick={() => handleDecrease(tire.codigo)}
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{selectedItems[tire.codigo]}</span>
                                        <button
                                            className="bg-gray-300 text-black font-bold py-1 px-3 rounded-r-full hover:bg-gray-400 transition duration-300"
                                            onClick={() => handleIncrease(tire.codigo)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300"
                                        onClick={() => handleAddClick(tire.codigo)}
                                    >
                                        Añadir
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cards;
