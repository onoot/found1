// pages/api/auth/logout.js

export default async (req, res) => {
    if (req.method === 'POST') {
        res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;');
        res.status(200).json({ message: 'Вы вышли' });
    } else {
        res.status(405).json({ message: 'Ошибка' });
    }
};
