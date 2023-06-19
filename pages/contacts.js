import Head from 'next/head';
import styles from '../styles/Home.module.css';
import withLayout from "../hoc/withLayout";
import {useState} from "react";

function Contacts() {
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Останавливаем стандартное действие отправки формы

        // Отправляем данные на сервер
        fetch('/api/contacts', {
            method: 'POST',
            body: JSON.stringify(formState),
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error));

        // Очищаем форму
        setFormState({
            name: '',
            phone: '',
            email: '',
            message: '',
        });
    };

    return (
        <>
            <div className={styles.contactContainer} style={{ paddingTop: '40px' }}>
                <div className={styles.contactForm}>
                    <form onSubmit={handleSubmit}>
                            <div>
                                <div className={styles.cardsettings}>
                                    <h1>Контакты</h1>
                                    <label htmlFor="name">Ваше имя:</label>
                                    <input type="text" id="name" name="name" value={formState.name} onChange={handleChange} />

                                    <label htmlFor="phone">Номер телефона:</label>
                                    <input type="tel" id="phone" name="phone" value={formState.phone} onChange={handleChange} />

                                    <label htmlFor="email">Ваш Email:</label>
                                    <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} />

                                    <label htmlFor="message">Сообщение:</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        rows={6}
                                    ></textarea>
                                </div>
                                    <button type="submit" className={styles.outpdata}>
                                        Отправить
                                    </button>
                            </div>
                        </form>
                    </div>
            </div>
        </>
    );
}

export default withLayout(Contacts);
