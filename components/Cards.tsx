import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Form from './Form';

// Update the interface to match the API response (PascalCase)
interface TireDetails {
  CODIGO: string;
  Modelo: string;
  Marca: string;
  MAY: number; // Assuming MAY is the price property
  Width: string;
  Aspect_Ratio: string;
  Construction: string;
  Diameter: string;
  Rango_Carga: string;
  Rango_Velocidad: string;
  USO: string;
  Fuente_Imagen: string;
}

interface CardProps {
  tireData: TireDetails[];
}

// ----------------------------------------------------
// Nuevo Componente Auxiliar para Fallback de Imagen
// ----------------------------------------------------
interface ImageFallbackProps {
  src: string;
  alt: string;
  // Añadir todas las props necesarias para el componente Image
  fill: boolean;
  sizes: string;
  className: string;
  style: React.CSSProperties;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({ src, ...props }) => {
  // Estado para la URL actual de la imagen (puede cambiar si falla)
  const [currentSrc, setCurrentSrc] = useState(src);
  // Estado para saber si ya probamos el fallback y evitar bucles infinitos
  const [triedFallback, setTriedFallback] = useState(false);

  // Resetear la URL cuando la prop 'src' cambie (ej: al cambiar de llanta)
  useEffect(() => {
    setCurrentSrc(src);
    setTriedFallback(false);
  }, [src]);

  const handleError = useCallback(() => {
    // Solo si aún no hemos probado el fallback
    if (!triedFallback) {
      setTriedFallback(true);

      // La lógica de fallback: si la URL termina en .png, intentar con .jpg
      if (currentSrc.toLowerCase().endsWith('.png')) {
        const newSrc = currentSrc.replace(/\.png$/i, '.jpg');
        setCurrentSrc(newSrc);
      }
      // Si la URL termina en .jpg, podríamos intentar con .png (si fuera necesario)
      // else if (currentSrc.toLowerCase().endsWith('.jpg')) {
      //     const newSrc = currentSrc.replace(/\.jpg$/i, '.png');
      //     setCurrentSrc(newSrc);
      // }
    }
  }, [currentSrc, triedFallback]);

  return (
    <Image
      {...props}
      src={currentSrc}
      onError={handleError}
    // Opcional: Si incluso el fallback falla, puedes poner una imagen por defecto
    // Si quieres un placeholder, usa:
    // onError={error => { handleError(error); error.currentTarget.src = 'URL_IMAGEN_DEFECTO'; }}
    />
  );
};
// ----------------------------------------------------
// Fin del Componente Auxiliar
// ----------------------------------------------------


const Cards: React.FC<CardProps> = ({ tireData }) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [showForm, setShowForm] = useState(false);

  // ... (El resto de tus funciones handleAddClick, handleIncrease, handleDecrease, etc., permanecen igual)

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
    selectedItems[tire.CODIGO] // Use CODIGO
  ).map(tire => ({
    ...tire,
    quantity: selectedItems[tire.CODIGO] // Use CODIGO
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
            <div key={tire.CODIGO} className="w-full sm:w-[320px]"> {/* Use CODIGO */}
              <div className="bg-[#F8F8FE] drop-shadow-lg rounded-lg p-6 h-full flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="w-[200px] h-[200px] relative overflow-hidden rounded-lg">
                    {/* ¡USAMOS EL NUEVO COMPONENTE ImageFallback AQUÍ! */}
                    <ImageFallback
                      src={`https://www.llantasyrenovado.com.mx/Llantas_y_renovados/Fotos/${tire.Fuente_Imagen}`} // URL inicial de la BD
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
                    {tire.Modelo}
                  </p>
                  <p className="text-sm font-light">
                    {tire.Width || "-"}{tire.Aspect_Ratio ? `/${tire.Aspect_Ratio}` : ''}{tire.Construction || "/"}{String(tire.Diameter).replace(',', '.')}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <p className="col-span-1"><strong>Marca:</strong> {tire.Marca}</p>
                    <p className="col-span-1"><strong>Uso:</strong> {tire.USO}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-row justify-between items-center">

                  {selectedItems[tire.CODIGO] ? ( // Use CODIGO
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <button
                          className="bg-gray-300 text-black font-bold py-1 px-3 rounded-l-full hover:bg-gray-400 transition duration-300"
                          onClick={() => handleDecrease(tire.CODIGO)} // Use CODIGO
                        >
                          -
                        </button>
                        <span className="px-4">{selectedItems[tire.CODIGO]}</span> {/* Use CODIGO */}
                        <button
                          className="bg-gray-300 text-black font-bold py-1 px-3 rounded-r-full hover:bg-gray-400 transition duration-300"
                          onClick={() => handleIncrease(tire.CODIGO)} // Use CODIGO
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300"
                      onClick={() => handleAddClick(tire.CODIGO)} // Use CODIGO
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