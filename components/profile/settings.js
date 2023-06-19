import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Home.module.css';
import { destroyCookie, parseCookies } from 'nookies';
import jwt from "jsonwebtoken";
import {toast} from "react-toastify";

const Settings = ({ token }) => {
    const cookies = parseCookies();

    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!token) {
            console.error('Не удалось найти токен!')
            toast.warning("Не удалось найти токен!");
            return;
        }
        try {
            const response = await axios.post(
                '/api/auth/settings',
                formState,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.gridP}>
            <h1>Настройки</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <span className={styles.categoryTitle}>Контакты:</span>
                    <div className={styles.cardsettings}>
                        <div className='ads'>
                            <label htmlFor="name">Ваше имя:</label>
                            <br />
                            <input type="text" id="firstName" name="firstName" value={formState.firstName} onChange={handleChange} />
                            <br />
                            <label htmlFor="phone">Номер телефона:</label>
                            <br />
                            <input type="tel" id="phone" name="phone" value={formState.phone} onChange={handleChange} />
                            <br />
                            <label htmlFor="email">Email:</label>
                            <br />
                            <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} />
                            <br />
                            <label htmlFor="birthday">Дата рождения:</label>
                            <br />
                            <input type="date" id="birthday" name="birthday" value={formState.birthday} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div>
                    <span className={styles.categoryTitle}>Безопасность:</span>
                    <div className={styles.cardsettings}>
                        <div className='ads'>
                            <label htmlFor="currentPassword">Текущий пароль:</label>
                            <br />
                            <input type="password" id="currentPassword" name="currentPassword" value={formState.currentPassword} onChange={handleChange} />
                            <br />
                            <label htmlFor="newPassword">Новый пароль:</label>
                            <br />
                            <input type="password" id="newPassword" name="newPassword" value={formState.newPassword} onChange={handleChange} />
                            <br />
                            <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
                            <br />
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formState.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <button className={styles.savedata} type="submit">Сохранить данные</button>
            </form>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.req.cookies;
    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    try {
        const decodedToken = jwt.verify(token, 'my_secret_key');
        // Добавить проверку, имеет ли пользователь права на просмотр страницы
    } catch (error) {
        console.error(`Ошибка получения токена: ${error.message}`)
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    return {
        props: { token },
    };
}

export default Settings;
