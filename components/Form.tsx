import React, { FormEvent } from 'react';
// import PriceDisplay from './PriceDisplay';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';

// Define an interface for a single selected tire that matches the data from Cards.tsx
interface SelectedTire {
    CODIGO: string;
    Modelo: string;
    Marca: string;
    // MAY: number;
    quantity: number; // Add the quantity property
    [key: string]: any; // Allow other properties
}

// Define the props for the Form component
interface FormProps {
    selectedTires: SelectedTire[]; // Use the new SelectedTire interface
    onBackToCards: () => void;
}

const Form: React.FC<FormProps> = ({ selectedTires, onBackToCards }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            firstName: event.currentTarget.firstName.value,
            lastName: event.currentTarget.lastName.value,
            email: event.currentTarget.email.value,
            mobile: event.currentTarget.mobile.value,
            comments: event.currentTarget.comments.value,
            selectedTires: selectedTires
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
                // alert('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
                toast.success('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
            } else {
                // alert('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
                toast.error('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Error de conexión al intentar enviar el mensaje.');
        }
    };

    // const totalAmount = selectedTires.reduce((sum, tire) => sum + (tire.MAY * tire.quantity), 0);

    return (
        <div className="flex flex-col justify-center items-center w-full px-5 mt-5">
            <Toaster position="bottom-right" richColors />
            <div className="w-full max-w-4xl bg-[#F8F8FE] rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#B7B6B6]">Resumen de tu orden</h2>
                    <button
                        onClick={onBackToCards}
                        className="bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition duration-300"
                    >
                        Seguir comprando
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {selectedTires.map((tire) => (
                        <div key={tire.CODIGO} className="flex items-center justify-between p-4 bg-white rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="font-bold">{tire.Modelo} - {tire.Marca}</p>
                                    <p className="text-sm text-gray-600">
                                        {tire.Width}/{tire.Aspect_Ratio}/{tire.Construction}{tire.Diameter}
                                    </p>
                                    <p className="text-sm">Cantidad: {tire.quantity}</p>
                                </div>
                            </div>
                            {/* <p className="font-bold">
                                <PriceDisplay amount={tire.MAY * tire.quantity} />
                            </p> */}
                        </div>
                    ))}
                    {/* <div className="text-right font-bold text-xl">
                        Total: <PriceDisplay amount={totalAmount} />
                    </div> */}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6 bg-[#F8F8FE] p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombres</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Número</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Especificaciones Adicionales</label>
                    <textarea
                        id="comments"
                        name="comments"
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-[#FF6600] text-white font-bold py-2 px-6 rounded-full hover:bg-[#FF8533] transition duration-300"
                    >
                        Enviar orden
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;