import jwt from "jsonwebtoken";
import { User } from "../database/user";

export function generateJWTToken(user) {
    const JWT_SECRET = 'my_secret_key';
    return jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export function generatePasswordResetToken(user) {
    return jwt.sign({ userId: user.id }, process.env.JWT_RESET_PASSWORD_SECRET, {
        expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    });
}

export async function verifyJWTToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { userId } = decoded;

        const user = await User.findById(userId);
        if (!user) {
            throw new jwt.JsonWebTokenError("Пользователь не найден");
        }

        return user;
    } catch (error) {
        throw error;
    }
}
