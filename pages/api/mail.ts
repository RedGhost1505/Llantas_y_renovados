import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

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
    quantity: number;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    comments: string;
    selectedTires: TireDetails[];
}

export default async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const { firstName, lastName, email, mobile, comments, selectedTires }: FormData = req.body;

    // Create a formatted list of tires
    const tiresHtml = selectedTires.map(tire => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">
                ${tire.modelo} - ${tire.marca}
            </td>
            <td style="padding: 8px; border: 1px solid #ddd;">
                ${tire.width}/${tire.aspect_ratio}/${tire.construction}${tire.diameter}
            </td>
            <td style="padding: 8px; border: 1px solid #ddd;">
                ${tire.quantity}
            </td>
            <td style="padding: 8px; border: 1px solid #ddd;">
                $${(tire.may * tire.quantity).toLocaleString()}
            </td>
        </tr>
    `).join('');

    const totalAmount = selectedTires.reduce((sum, tire) => sum + (tire.may * tire.quantity), 0);

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: 'contactollantasyrenovado@gmail.com',
        subject: `Nueva orden de llantas de: ${firstName} ${lastName}`,
        text: `
            Nueva orden de ${firstName} ${lastName}
            Datos de contacto: ${email}, Tel: ${mobile}

            Llantas seleccionadas:
            ${selectedTires.map(tire =>
            `- ${tire.modelo} - ${tire.marca}
                 Medida: ${tire.width}/${tire.aspect_ratio}/${tire.construction}${tire.diameter}
                 Cantidad: ${tire.quantity}
                 Subtotal: $${(tire.may * tire.quantity).toLocaleString()}`
        ).join('\n\n')}

            Total: $${totalAmount.toLocaleString()}

            Comentarios adicionales: ${comments || 'Ninguno'}
        `,
        html: `
            <h2>Nueva orden de ${firstName} ${lastName}</h2>
            <p><strong>Datos de contacto:</strong> ${email}, Tel: ${mobile}</p>
            
            <h3>Llantas seleccionadas:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Modelo</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Medida</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${tiresHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Total:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>$${totalAmount.toLocaleString()}</strong></td>
                    </tr>
                </tfoot>
            </table>

            <p><strong>Comentarios adicionales:</strong><br>${comments || 'Ninguno'}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'success', message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ status: 'error', message: 'Error al enviar el email', details: error });
    }
}