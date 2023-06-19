import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../styles/Home.module.css';
import withLayout from "../hoc/withLayout";
import Link from "next/link";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Registration() {
    const [isRegister, setIsRegister] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    const handleSwitchMode = () => {
        setIsRegister(prevMode => !prevMode);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== repeatPassword) {
            toast.error('Пароли не совпадают!');
            setError("Пароли не совпадают");
            return;
        }
        try {
            const res = await axios.post('/api/auth/register', {
                firstName: 'User',
                lastName: '1010',
                email,
                password,
                city: 'Москва'});


            toast.success('Успешная регистрация!');

        } catch (error) {
            console.log(error)
            toast.error('Ошибка!');
            setError("Ошибка на сервере!");

        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.loginPage}>
            <div className={styles.logoContainer}>
                <img className={styles.auth} src="/svg.svg" alt="Logo" />
                <h1 className={styles.title}>Всероссийская система поиска пропавших животных
                </h1>
            </div>
            <div className={styles.cardsettings}>
                <h2>Зарегистрироваться</h2>
                <form>
                        <>
                            <label htmlFor="password">Пароль:</label>
                            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                            <label htmlFor="repeatPassword">Повторите пароль:</label>
                            <input type="password" id="repeatPassword" value={repeatPassword} onChange={handleRepeatPasswordChange} />
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={handleEmailChange} />
                        </>
                    <div className={styles.lo}>
                        <button
                            className={styles.savedata}
                            disabled={isLoading}
                            onClick={handleRegister}>
                            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
                        </button>
                        <button className={styles.loB} onClick={handleSwitchMode}>
                          <Link
                              href={"/login"}
                          >
                              У меня уже есть аккаунт
                          </Link>
                        </button>
                    </div>
                </form>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
}

export default withLayout(Registration);
