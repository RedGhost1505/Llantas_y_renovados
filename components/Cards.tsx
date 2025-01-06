import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Form from './Form';

interface TireDetails {
  codigo: string;
  modelo: string;
  marca: string;
  may: number;
  width: string;
  aspect_ratio: string;
  construction: string;
  diameter: string;
  rango_carga: string;
  rango_velocidad: string;
  uso: string;
  fuente_imagen: string;
}

interface CardProps {
  tireData: TireDetails[];
}

const Cards: React.FC<CardProps> = ({ tireData }) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [showForm, setShowForm] = useState(false);

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
        const { [tireId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [tireId]: newCount };
    });
  };

  const handleOrder = () => {
    setShowForm(true);
  };

  const handleBackToCards = () => {
    setShowForm(false);
  };

  // Encontrar los detalles completos de las llantas seleccionadas
  const selectedTiresDetails = tireData.filter(tire =>
    selectedItems[tire.codigo]
  ).map(tire => ({
    ...tire,
    quantity: selectedItems[tire.codigo]
  }));

  if (showForm) {
    return <Form
      selectedTires={selectedTiresDetails}
      onBackToCards={handleBackToCards}
    />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-[#B7B6B6]">
            Selecciona una de nuestras llantas
          </p>
        </div>

        {/* Cart Summary - Only show if there are selected items */}
        {Object.keys(selectedItems).length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <p className="font-bold mb-2">Llantas seleccionadas: {
              Object.values(selectedItems).reduce((a, b) => a + b, 0)
            }</p>
            <button
              onClick={handleOrder}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Ordenar selección
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {tireData.map((tire) => (
            <div key={tire.codigo} className="w-full sm:w-[320px]">
              <div className="bg-[#F8F8FE] drop-shadow-lg rounded-lg p-6 h-full flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="w-[200px] h-[200px] relative overflow-hidden rounded-lg">
                    <Image
                      src={tire.fuente_imagen}
                      alt="tyre"
                      fill
                      sizes="200px"
                      className="object-contain"
                      style={{
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="font-bold text-xl">
                    {tire.modelo}
                    <span className="font-normal text-sm"> - {tire.marca} </span>
                  </p>

                  <p className="mt-1">
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
                </div>

                <div className="mt-4 flex flex-row justify-between items-center">
                  <p className="font-bold text-xl text-red-500">MX ${tire.may}</p>

                  {selectedItems[tire.codigo] ? (
                    <div className="flex flex-col items-center">
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
    </div>
  );
};

export default Cards;