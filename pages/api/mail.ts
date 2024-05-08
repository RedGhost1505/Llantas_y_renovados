import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { firstName, lastName, email, mobile, comments } = req.body;

        let transporter = nodemailer.createTransport({
            service: 'gmail', // O tu proveedor SMTP
            auth: {
                user: 'llyrgeneralasociados@gmail.com',
                pass: 'LlyRenovado24+'
            }
        });

        let mailOptions = {
            from: 'llyrgeneralasociados@gmail.com',
            to: 'joshalejandro117@gmail.com',
            subject: 'Nuevo mensaje del formulario de contacto',
            text: `Nombres: ${firstName}\nApellidos: ${lastName}\nEmail: ${email}\nNúmero: ${mobile}\nEspecificaciones Adicionales: ${comments}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Mensaje enviado correctamente' });
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            res.status(500).json({ error: 'Error al enviar el mensaje' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};