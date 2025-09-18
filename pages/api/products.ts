import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

type Data = {
    message?: string;
    productos?: any[]; // You can define a more specific type here
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const query = `
            SELECT 
                \`COL 1\` as SKU,
                \`COL 2\` as CODIGO,
                \`COL 3\` as Fuente,
                \`COL 4\` as Marca,
                \`COL 5\` as Width,
                \`COL 6\` as Aspect_Ratio,
                \`COL 7\` as Construction,
                \`COL 8\` as Diameter,
                \`COL 9\` as Modelo,
                \`COL 10\` as Rango_Carga,
                \`COL 11\` as Rango_Velocidad,
                \`COL 12\` as Runflat,
                \`COL 13\` as USO,
                \`COL 14\` as CAPAS,
                \`COL 15\` as Fuente_Imagen
            FROM llyr_base_de_datos_xlsx___sheet1
        `;
        const [rows] = await pool.execute(query);
        res.status(200).json({ productos: rows as any[] });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}