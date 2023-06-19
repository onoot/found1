import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import axios from "axios";

const PetADD = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [animal, setAnimal] = useState("Кошка");
    const [status, setStatus] = useState("Пропавшие");
    const [ads, setAds] = useState([]);

    const handleShowFilters = () => {
        setShowFilters(true);
    };

    const handleCloseFilters = () => {
        setShowFilters(false);
    };

    const handleAnimalSelect = (e) => {
        setAnimal(e.target.innerText);
    };

    const handleStatusSelect = (e) => {
        setStatus(e.target.innerText);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("/api/ads/searchads", {
                params: {
                    animal: animal,
                    status: status
                }
            });
            setAds(response.data); // Обновляем состояние "ads" данными полученными с сервера
            handleCloseFilters(); // Закрываем окно с фильтрами
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const { data } = await axios.get("/api/ads/searchads");
                setAds(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAds();
    }, []);

    return (
        <div>
            {!showFilters && (
                <form className={styles.forma}>
                    <div className={styles.searh}>
                        <div className={styles.searchI}>Область карты</div>
                        <button className={styles.sbutton} onClick={handleShowFilters}>
                            <img src={"/search.svg"} alt="фильтр" />
                        </button>
                    </div>
                    <p className={styles.outputS}>Найдено {ads.length} животных</p>
                    <p>База пропавших животных и найденных животных</p>
                    <div className={styles.grid}>
                        {ads.map((ad) => (
                            <div className={styles.card} key={ad.id}>
                                {/* замените значения src на настоящие изображения */}
                                {ad.photo ? (
                                    <img src={ad.photo} alt={ad.name} className={styles.photo} />
                                ) : (
                                    <img
                                        src="https://kartinkin.net/uploads/posts/2021-01/thumbs/1611412760_6-p-chernii-fon-so-znakom-voprosa-6.jpg"
                                        alt="Нет фото"
                                        className={styles.photo}
                                    />
                                )}
                                <div className="ads">
                                    <h3>{ad.name}</h3>
                                    <p>{ad.description}</p>
                                    <p>{ad.data}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </form>
            )}
            {showFilters && (
                <div className={styles.formf}>
                    <div className={styles.filterHeader}>
                        <p2 className={styles.filterH}>Укажите место</p2>
                        <button className={styles.closeBtn} onClick={handleCloseFilters}>
                            X
                        </button>
                    </div>
                    <div className={styles.filterSection}>
                        <h3>Кого ищем?</h3>
                        <div>
                            <button onClick={handleAnimalSelect}>Собака</button>
                            <button onClick={handleAnimalSelect}>Кошка</button>
                            <button onClick={handleAnimalSelect}>Другое</button>
                        </div>
                        <p>Выбрано: {animal}</p>
                    </div>
                    <div className={styles.filterSection}>
                        <h3>Статус</h3>
                        <div>
                            <button onClick={handleStatusSelect}>Пропавшие</button>
                            <button onClick={handleStatusSelect}>Найденные</button>
                        </div>
                        <p>Выбрано: {status}</p>
                    </div>   <div className={styles.buttonOut}>
                    <button className={styles.dataOut} onClick={handleSubmit}>
                        Показать объявления
                    </button>
                    <button className={styles.exit} onClick={handleCloseFilters}>
                        Закрыть
                    </button>
                </div>
                </div>
            )}
        </div>
    );
};

export default PetADD;
