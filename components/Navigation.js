import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import jwt from "jsonwebtoken";
import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = () => {
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            const res = await fetch('/api/auth/profile', {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.user) {
                setUserName(data.user.firstName);
            }
            setIsLoading(false);
        }
        fetchUser();
    }, []);

    async function handleLogout() {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (res.ok) {
            router.reload();
        }
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <img src="/svg.svg" alt="logo" className={styles.svg} />
                <Link href={'/'}>
                    <h1>Найдёныш</h1>
                </Link>
            </div>
            <Link href="/contacts">Контакты</Link>
            <Link href="/bulletins">
                Объявления
                <div className={styles.adsN}>
                    <div className={styles.adss} data="1"></div>
                </div>
            </Link>
            <Link href="/help">Помощь</Link>
            <Link href="/about" className="col-2">О Нас</Link>
            <button className={styles.menuButton_report}>
                Сообщить о пропаже
            </button>
            <div className={styles.rightMenu}>
                {isLoading ? (
                    <span>Загрузка...</span>
                ) : userName ? (
                    <LoggedInMenu handleLogout={handleLogout} userName={userName} />
                ) : (
                    <Link href="/login">Войти</Link>
                )}
            </div>
        </nav>
    );
};

const LoggedInMenu = ({ handleLogout, userName }) => {
    return (
        <>
            <div className={styles.profileButton}>
                <Link href="/profile">{userName}</Link>
                <img src="/profill.webp" alt="Profile photo" />
            </div>
        </>
    );
};

export default Navigation;

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
        return {
            props: {},
        };
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
}
