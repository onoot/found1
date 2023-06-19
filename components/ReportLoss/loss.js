import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

const LostPetForm = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [petType, setPetType] = useState("");
    const [petBreed, setPetBreed] = useState("");
    const [petColor, setPetColor] = useState("");
    const [petName, setPetName] = useState("");
    const [petPhoto, setPetPhoto] = useState(null);
    const [address, setAddress] = useState("");
    const [coords, setCoords] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            // Обработка данных первого шага
        } else if (step === 2) {
            // Обработка данных второго шага
            setStep(3);
        } else {
            // Обработка данных третьего шага
            // Отправка данных на сервер
            onClose();
        }
    };

    const handleFileChange = (e) => {
        setPetPhoto(e.target.files[0]);
    };

    const handleMapClick = (e) => {
        const { coords } = e.get('target');
        setCoords(coords);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handlePhoneInputChange = (e) => {
        const input = e.target.value;
        // Замена '-' на цифры
        const numbersOnly = input.replace(/-/g, '').slice(0, 10);
        setPhoneNumber(numbersOnly);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h2>{step === 1 ? "Я потерял своего питомца" : step === 2 ? "Укажите место, где потерялся питомец" : "Укажите свой номер телефона"}</h2>
                {step === 1 &&
                    <div className={styles.cardContainer}>
                        {/* Карточки */}
                    </div>
                }
                {step === 2 &&
                    <>
                        <div className={styles.formControl}>
                            <label htmlFor="address">Адрес:</label>
                            <input id="address" type="text" value={address} onChange={handleAddressChange} />
                        </div>
                        <div className={styles.mapContainer}>
                            <YMaps>
                                <Map state={{ center: [55.753994, 37.622093], zoom: 10 }} width="100%" height="100%" onClick={handleMapClick}>
                                    {coords && <Placemark geometry={coords} options={{ iconLayout: 'default#image', iconImageHref: '/yandex.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -30] }} />}
                                </Map>
                            </YMaps>
                        </div>
                    </>
                }
                {step === 3 &&
                    <div className={styles.formControl}>
                        <label htmlFor="phone">Номер телефона:</label>
                        <input id="phone" type="text" value={phoneNumber} onChange={handlePhoneInputChange} maxLength="12" />
                    </div>
                }
                {step === 1 &&
                    <div className={styles.formControlContainer}>
                        <div className={styles.formControl}>
                            <label htmlFor="pet-type">Вид питомца:</label>
                            <select id="pet-type" value={petType} onChange={(e) => setPetType(e.target.value)}>
                                <option value="">Выбрать</option>
                                <option value="dog">Собака</option>
                                <option value="cat">Кошка</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor="pet-breed">Порода:</label>
                            <input id="pet-breed" type="text" value={petBreed} onChange={(e) => setPetBreed(e.target.value)} />
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor="pet-color">Цвет:</label>
                            <input id="pet-color" type="text" value={petColor} onChange={(e) => setPetColor(e.target.value)} />
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor="pet-name">Кличка:</label>
                            <input id="pet-name" type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor="pet-photo">Фото:</label>
                            <input id="pet-photo" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                }
                <div className={styles.buttonContainer}>
                    {step !== 1 && <button type="button" onClick={() => setStep(step - 1)}>Предыдущий шаг</button>}
                    <button type="submit">{step === 3 ? "Сохранить заявку" : "Следующий шаг"}</button>
                </div>
            </form>
        </div>
    ); };

export default LostPetForm;
