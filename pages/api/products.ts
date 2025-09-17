import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

type Data = {
    message?: string;
    productos?: any[]; // Puedes definir un tipo más específico aquí
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM llyr_base_de_datos_xlsx___sheet1');
        res.status(200).json({ productos: rows as any[] });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}