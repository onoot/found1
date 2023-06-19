import jwt from 'jsonwebtoken';
import { User, Phone, Email, City } from '../database/user';

const JWT_SECRET = 'my_secret_key';

export default async function handler(req, res) {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'Токен отсутствует' });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({
            where: { id: decodedToken.id },
            include: [
                { model: Email, as: 'Email' },
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ user: { firstName: user.firstName } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка получения профиля'+error });
    }
}
