import jwt from "jsonwebtoken";
import { User } from "../database/user";

export default async (req, res) => {
    const JWT_SECRET = 'my_secret_key';
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const { userId } = decoded;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Обновляем данные пользователя
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.phone) {
            user.phone = req.body.phone;
        }
        if (req.body.birthday) {
            user.birthday = req.body.birthday;
        }

        if (req.body.newPassword) {
            // Если пользователь хочет изменить пароль,
            // проверяем, совпадают ли пароли.
            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(400).json({ message: "Пароли не совпадают" });
            }

            // Проверяем, верный ли текущий пароль
            const isMatch = await user.comparePasswords(req.body.currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: "Неверный текущий пароль" });
            }

            // Обновляем пароль
            user.setPassword(req.body.newPassword);
        }

        await user.save();
        return res.status(200).json({ message: "Данные профиля успешно обновлены" });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res
                .status(401)
                .json({ message: "Сессия истекла. Войдите снова в аккаунт." });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ message: "Невалидный токен. Войдите снова в аккаунт." });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
};

export async function sendPasswordResetEmail(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({ message: "Аккаунт с такой почтой не существует" });
        }

        // Создаем токен для сброса пароля

        // Отправляем email с инструкциями по сбросу пароля
        // ...

        return res.json({
            message: "Инструкции по сбросу пароля отправлены на почту",
        });
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}

export async function resetPassword(req, res) {
    const { token, password } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        user.setPassword(password);
        await user.save();

        return res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}
