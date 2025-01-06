// pages/api/mail.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
        return;
    }

    // Configuración del transportador SMTP utilizando Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const { firstName, lastName, email, mobile, comments, make, model, year, modification, tire, rim_diameter } = req.body;

    // Configuración del mensaje
    const mailOptions = {
        from: process.env.GMAIL_EMAIL, // Tu dirección de correo Gmail
        to: 'contactollantasyrenovado@gmail.com', // Dirección del destinatario
        subject: `Cotización nueva de: ${firstName} ${lastName}`,
        text: `Tienes un pedido nuevo de ${firstName} ${lastName} sus datos son: (${email}, Tel: ${mobile}).\n\nCotización: ${make}, Modelo: ${model}, Año: ${year}, Modificación: ${modification}, Llanta: ${tire}, Rin: ${rim_diameter}\n\nComentarios: ${comments}`,
        html: `<strong>Tienes una cotización nueva de ${firstName} ${lastName} sus datos son: (${email}, Tel: ${mobile}).</strong>
        <p>Cotización: ${make}, Modelo: ${model}, Año: ${year}, Modificación: ${modification}, Llanta: ${tire}, Rin: ${rim_diameter}</p>
        <p></p>
        <p>Comentarios: ${comments}</p>`
    };

    // Enviar el correo
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'success', message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ status: 'error', message: 'Error al enviar el email', details: error });
    }
}
