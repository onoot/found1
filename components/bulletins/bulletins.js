import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from "react-yandex-maps";
import styles from "../../styles/Home.module.css";
import { toast } from "react-toastify";
import PetADD from "../ads/peradd";
import axios from "axios";

const MyBulletins = () => {
    const [placemarks, setPlacemarks] = useState([]);
    const [isLostPetActive, setIsLostPetActive] = useState(true);
    const [searchError, setSearchError] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        petType: "",
        petBreed: "",
        description: "",
        image: null,
        isLostPet: true,
        buttonType: 'lost'
    });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newPlacemarkCoordinates, setNewPlacemarkCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = (type) => {
        const isLostPet = type === "lost";
        setIsLostPetActive(isLostPet);

        // Скрываем форму, если одна и та же кнопка была нажата 2 раза подряд
        if (isFormVisible && isLostPet === formData.isLostPet) {
            setIsFormVisible(false);
            return;
        }

        // Отображаем форму и обновляем isLostPet в formData
        setIsFormVisible(true);
        setFormData((prevData) => ({ ...prevData, isLostPet, buttonType: type }));
        // Дополнительно добавляем значение типа кнопки в объект данных формы
    };

    const getPlacemarkOptions = (type) => {
        const options = {
            iconLayout: "default#image",
            iconImageSize: [45, 45],
            iconImageOffset: [-22.5, -45],
        };
        switch (type) {
            case "lost":
                return {
                    ...options,
                    iconImageHref: "/red.svg",
                };
            case "found":
                return {
                    ...options,
                    iconImageHref: "/green.svg",
                };
            case "new":
                return {
                    ...options,
                    iconImageHref: "/yandex.svg",
                };
            default:
                return options;
        }
    };

    const handleGeolocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapState({ center: [latitude, longitude], zoom: 15 });
                    handleSearchDataSubmit({lat: latitude, long: longitude});
                },
                () => {
                    toast.error(
                        "Произошла ошибка при определении местоположения. Пожалуйста, разрешите доступ к геопозиции или попробуйте позже.",
                        { position: "top-right" }
                    );
                }
            );
        } else {
            toast.error("Геопозиция не поддерживается данным браузером.", {
                position: "top-right",
            });
        }
    };

    const [mapState, setMapState] = useState({
        center: [55.753994, 37.622093],
        zoom: 15,
    });

    const handleFormFieldChange = (event) => {
        const { name, value, files } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSearchDataSubmit = (coordinates) => {
        const { lat, long } = coordinates;
        const data = {
            lat,
            long,
            isLostPet: isLostPetActive,
            buttonType: formData.buttonType,
        };
        setIsLoading(true);
        axios.post("/api/submit", data)
            .then((response) => {
                setPlacemarks(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    toast.warning("Объявлений в данной локации не найдено", {
                        position: "top-right"
                    });
                } else {
                    toast.error("Ошибка получения данных на сервер", {
                        position: "top-right"
                    });
                }
                setIsLoading(false);
            });
    };


    const handleMapClick = (event) => {
        const coordinates = event.get("coords");
        setNewPlacemarkCoordinates(coordinates);
        // сохраняем координаты метки в состоянии
        setIsFormVisible(true);
        setFormData((prevData) => ({ ...prevData, isLostPet: isLostPetActive }));
    };

    useEffect(() => {
        handleSearchDataSubmit({lat: mapState.center[0], long: mapState.center[1]});
    }, [isLostPetActive]);
    const handleBoundsChange = (event) => {
        const newCenter = event.get("newCenter");
        const newZoom = event.get("newZoom");
        const newBounds = event.get("newBounds");
        setMapState({ center: newCenter, zoom: newZoom });
        const data = {
            lat1: newBounds[0][0],
            lon1: newBounds[0][1],
            lat2: newBounds[1][0],
            lon2: newBounds[1][1],
            isLostPet: isLostPetActive,
            buttonType: formData.buttonType,
        };
        setIsLoading(true);
        axios.post("/api/submit", data)
            .then((response) => {
                setPlacemarks([...placemarks, ...response.data]);
                setIsLoading(false);
            })
            .catch((error) => {
                let statusCode = 0;
                if (error.response) {
                    statusCode = error.response.status;
                }
                setIsLoading(false);
                if (statusCode === 404) {
                    toast.warning("Объявлений в данной локации не найдено", {
                        position: "top-right"
                    });
                } else {
                    toast.error("Ошибка получения данных на сервер", {
                        position: "top-right"
                    });
                }
            });
    };
    return (
        <YMaps>
            {isFormVisible && (
                <div className={styles.control}>

                </div>
            )}

            <Map state={mapState} width="100%" height="1000px" onClick={handleMapClick}>
                <GeolocationControl options={{ float: "left" }} onClick={handleGeolocationClick} />
                <ZoomControl options={{ float: "right" }} />
                {searchError && (
                    <div className={styles.error}>В данной локации объявлений не найдено.</div>
                )}
                <div className={styles.control}>
                    <PetADD
                        formData={formData}
                        handleFormFieldChange={handleFormFieldChange}
                        coordinates={newPlacemarkCoordinates || mapState.center}
                    />
                </div>
                {placemarks.length > 0 &&
                    placemarks.map((placemark, i) => (
                        <Placemark
                            key={`placemark-${i}`}
                            geometry={placemark.coordinates}
                            options={getPlacemarkOptions(placemark.type)}
                        />
                    ))}
                {newPlacemarkCoordinates && (
                    // добавление новой метки, только если есть сохраненные координаты
                    <Placemark
                        geometry={newPlacemarkCoordinates}
                        options={getPlacemarkOptions("new")}
                    />
                )}
            </Map>
        </YMaps>
    ); };

export default MyBulletins;

