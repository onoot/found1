import withLayout from '../hoc/withLayout'
import Myads from '../components/profile/myads'
import Settings from '../components/profile/settings'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import jwt from "jsonwebtoken";
import { destroyCookie } from 'nookies';
import "bootstrap/dist/css/bootstrap.min.css";
import {toast} from "react-toastify";
import axios from "axios";

const Profile = () => {
    const [componentToShow, setComponentToShow] = useState(<Settings />)

    const handleButtonClick = (component) => {
        setComponentToShow(component)
    }

    const handleLogout = () => {
        destroyCookie(null, 'token');
        const response = axios.post("/api/auth/logout", {})
        if (response.status === 200) {
            toast.warning('Вы вышли');

        } else {
            toast.warning("Ошибка");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.profContainer}>
                <div className={styles.lefthelp}>
                    <h1>Профиль</h1>
                    <div className={styles.profileInfo}>
                        <img
                            src="/profill.webp"
                            alt="Фото профиля"
                            className={styles.profilePhoto}
                        />
                    </div>
                    <div className={styles.profileNavigation}>
                        <div>
                            <button
                                onClick={() => handleButtonClick(<Myads />)}
                                className={styles.favorButton}
                            >
                                <img src="/myads.png" alt="ads" className={styles.favor} />
                                Мои Объявления
                            </button>
                        </div>
                        <div className={styles.favorGor}>
                            <button
                                onClick={() => handleButtonClick(<Settings />)}
                                className={styles.favorButton}
                            >
                                <img src="/set.png" alt="set" className={styles.favor} />
                                Настройки
                            </button>
                        </div>
                        <div className={styles.favorGor}>
                            <button
                                onClick={() => handleButtonClick(<Myads />)}
                                className={styles.favorButton}
                            >
                                <img src="/egg.png" alt="fav" className={styles.favor} />
                                Избранное
                            </button>
                        </div>
                        <div>
                            <button
                                className={styles.profileLogOut}
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
                <div>{componentToShow}</div>
            </div>
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
        // здесь необходимо добавить логику проверки, имеет ли пользователь права на просмотр страницы
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}

export default withLayout(Profile)
