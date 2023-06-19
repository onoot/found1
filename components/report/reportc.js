import styles from '../../styles/Home.module.css';
import Link from "next/link";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";


function ReportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [desc, setDesc] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);

    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };
    const handlePhotoChange = (e) => {
        setPhoto(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // тут можно отправить данные формы на сервер
        console.log(`Имя: ${name}, Email: ${email}`);

        // сброс состояний
        setName('');
        setEmail('');
        setType('');
        setAddress('');
        setDesc('');
        setIsOpen(false);

        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await axios.post('/api/addads', formData);

            if (response.status === 200) {
                toast.success('Объявление добавлено!');
            } else {
                toast.error('Не удалось добавить объявление.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Не удалось добавить объявление.');
        }
    };

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    let formContent;

    if (formType === 'lost') {
        formContent = (
            <>
                <label>
                    <div>Имя питомца:</div>
                    <input className="input" type="text" value={name} onChange={handleNameChange} required />
                </label>

                <label>
                    <div>Вид:</div>
                    <input type="text" value={type} onChange={handleTypeChange} required />
                </label>

                <label>
                    <div>Описание:</div>
                    <input type="text" value={desc} onChange={handleDescChange} required />
                </label>

                <label>
                    <div>Пол:</div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="male"
                                checked={gender === 'male'}
                                onChange={handleGenderChange}
                            />
                            Мужской
                        </label>
                        <label>
                           <div>
                               <input
                                   type="radio"
                                   value="other"
                                   checked={gender === 'other'}
                                   onChange={handleGenderChange}
                               />
                               Другой
                           </div>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="female"
                                checked={gender === 'female'}
                                onChange={handleGenderChange}
                            />
                            Женский
                        </label>
                    </div>
                </label>

                <label>
                   <div>Место пропажи пропажи:</div>
                    <input type="text" value={address} onChange={handleAddressChange} required />
                </label>

                <label>
                    <div>Email:</div>
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </label>            <label>
                <div>Дата пропажи:</div>
                <input type="date" value={date} onChange={handleDateChange} required />
            </label>

                <label>
                    <div>Фото питомца:</div>
                    <input type="file" name="photo" accept="image/*" onChange={handlePhotoChange} required/>
                </label>

                <button className={styles.sendButton} type="submit">Отправить</button>
            </>
        );
    } else if (formType === 'found') {
        formContent = (
            <>
                <label>
                    <div>Если есть имя на ошейнике:</div>
                    <input className="input" type="text" value={name} onChange={handleNameChange} required />
                </label>

                <label>
                    <div>Вид:</div>
                    <input type="text" value={type} onChange={handleTypeChange} required />
                </label>

                <label>
                    <div>Описание:</div>
                    <input type="text" value={desc} onChange={handleDescChange} required />
                </label>

                <label>
                    <div>Пол:</div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="male"
                                checked={gender === 'male'}
                                onChange={handleGenderChange}
                            />
                            Мужской
                        </label>
                        <label>
                            <div>
                                <input
                                    type="radio"
                                    value="other"
                                    checked={gender === 'other'}
                                    onChange={handleGenderChange}
                                />
                                Другой
                            </div>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="female"
                                checked={gender === 'female'}
                                onChange={handleGenderChange}
                            />
                            Женский
                        </label>
                    </div>
                </label>

                <label>
                    Место нахождения питомца:
                    <input type="text" value={address} onChange={handleAddressChange} required />
                </label>

                <label>
                    <div>Email:</div>
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </label>

                <label>
                    <div>Дата нахождения:</div>
                    <input type="date" value={date} onChange={handleDateChange} required />
                </label>

                <label>
                    <div>Фото питомца:</div>
                    <input type="file" name="photo" accept="image/*" onChange={handlePhotoChange} required/>
                </label>

                <button className={styles.sendButton} type="submit">Отправить</button>
            </>
        );
    }

    return (
        <div className={styles.menu_report}>
            <button className={styles.menuButton_report} onClick={handleMenuClick}>
                {isOpen ? 'Сообщение о пропаже...' : 'Сообщить о пропаже'}
            </button>

            {isOpen && (
                <div className={styles.menuContent_report}>
                    <div>
                        <button className={styles.seButton} onClick={() => setFormType('lost')}>Пропал питомец</button>
                        <button className={styles.sendButton} onClick={() => setFormType('found')}>Найден питомец</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {formContent}
                    </form>
                </div>
            )}
        </div>
    );}

export default ReportButton;
