import jwt from "jsonwebtoken";
import {User} from "./database/user";

export default async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }

        const decoded = jwt.verify(token, "my-secret-key");
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            res.status(401).json({ message: "Пользователь не найден" });
            return;
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
