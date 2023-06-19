import { useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";
import withLayout from "../hoc/withLayout";
import Link from "next/link";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSwitchMode = () => {
        setIsRegister((prevMode) => !prevMode);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Проверка наличия email и пароля
        if (!email.trim() || !password.trim()) {
            setError("Необходимо заполнить все поля");
            setIsLoading(false);
            return;
        }

        setError("");

        try {
            const response = await axios.post("/api/auth/login", {
                email,
                password,
            });
            if (response.data.message === "Авторизация прошла успешно") {
                toast.success("Успешная авторизация");
                window.location.href = '/profile';

            } else {
                toast.warning("Неуспешная авторизация");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
                toast.warning("Неуспешная авторизация: " + error.response.data.message);
            } else {
                setError("Ошибка сервера");
                toast.warning("Неуспешная авторизация (ошибка сервера)");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.logoContainer}>
                <img className={styles.auth} src="/svg.svg" alt="Logo" />
                <h1 className={styles.title}>
                    Всероссийская система поиска пропавших животных
                </h1>
            </div>
            <div className={styles.cardsettings}>
                <h2>Войти</h2>
                <form>
                    <>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </>
                    <div className={styles.lo}>
                        <button
                            className={styles.savedata}
                            disabled={isLoading}
                            onClick={handleSubmit}>
                            {isLoading ? "Загрузка..." : "Войти"}
                        </button>
                        <button className={styles.loB} onClick={handleSwitchMode}>
                            <Link href={"/registration"}>Зарегистрироваться</Link>
                        </button>
                    </div>
                </form>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
}

export default withLayout(LoginPage);
