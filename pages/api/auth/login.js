import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Phone, Email, City } from '../database/user';

const JWT_SECRET = 'my_secret_key';

export default async function handler(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { '$Email.address$': email },
            include: [
                { model: Phone, as: 'Phone' },
                { model: Email, as: 'Email' },
                { model: City, as: 'City' }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.Email.address },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.setHeader('Set-Cookie', [
            `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict;`,
        ]);

        res.status(200).json({
            message: 'Авторизация прошла успешно',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.Phone?.number || null,
                email: user.Email.address,
                city: user.City?.name || null
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка авторизации' });
    }
}
