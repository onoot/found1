import { User, Phone, Email, City } from '../database/user';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

export default async function handler(req, res) {
    const { firstName, lastName, phoneNumber, email, password, city } = req.body;

    try {
        // Проверка на уникальность email и phoneNumber
        let existingUser;
        if (phoneNumber && email) {
            existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { '$Phone.number$': phoneNumber },
                        { '$Email.address$': email }
                    ]
                },
                include: [
                    { model: Phone, as: 'Phone' },
                    { model: Email, as: 'Email' }
                ]
            });
        } else if (phoneNumber) {
            existingUser = await User.findOne({
                where: { '$Phone.number$': phoneNumber },
                include: [{ model: Phone, as: 'Phone' }]
            });
        } else if (email) {
            existingUser = await User.findOne({
                where: { '$Email.address$': email },
                include: [{ model: Email, as: 'Email' }]
            });
        } else {
            res.status(400).json({ message: 'Необходимо указать email или номер телефона' });
            return;
        }

        if (existingUser) {
            if (existingUser.Phone && existingUser.Phone.number === phoneNumber) {
                res.status(400).json({ message: 'Такой номер телефона уже зарегистрирован' });
            } else if (existingUser.Email && existingUser.Email.address === email) {
                res.status(400).json({ message: 'Такой email уже зарегистрирован' });
            }
            return;
        }

        // Хеширование пароля перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10);

        // Поиск или создание записей в связанных таблицах
        let phoneInstance, emailInstance;
        if (phoneNumber) {
            phoneInstance = await Phone.create({ number: phoneNumber });
        }
        if (email) {
            emailInstance = await Email.create({ address: email });
        }
        const [cityInstance, created] = await City.findOrCreate({ where: { name: city } });

        // Создание нового пользователя
        const user = await User.create({ firstName, lastName, password: hashedPassword });
        if (phoneInstance) {
            await user.setPhone(phoneInstance);
        }
        if (emailInstance) {
            await user.setEmail(emailInstance);
        }
        await user.setCity(cityInstance);

        res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка регистрации пользователя' });
    }
}
