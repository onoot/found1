import React, {useEffect, useState} from "react";
import PhoneInput from "react-phone-input-2";

function PetForm(props) {

    const {newPlacemarkCoordinates}=props
    const [petType, setPetType] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState("male");
    const [color, setColor] = useState("");
    const [photo, setPhoto] = useState(null);
    const [comment, setComment] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const [page, setPage] = useState(1);

    const [phone, setPhone] = useState("");

    const [petTypes, setPetTypes] = useState(["Загрузка..."]);
    const [petBreeds, setPetBreeds] = useState(["Не выбрано"]);
    const [petColors, setPetColors] = useState(["Не выбрано"]);

    useEffect(() => {
        fetch("/api/list")
            .then((response) => response.json())
            .then((data) => {
                setPetTypes(data.petTypes);
                setPetColors(data.petColors);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;

        if (selectedType === "Не выбрано") {
            setPetBreeds(["Не выбрано"]);
            return;
        }

        // Запрос к серверу на получение списка пород для выбранного Рода
        fetch(`/api/list?type=${selectedType}`)
            .then((response) => response.json())
            .then((data) => {
                setPetBreeds([selectedType, ...data.petBreeds]);
            })
            .catch((error) => console.error(error));
    };

    const handlePhoneChange = (value) => {
        setPhone(value);
    };

    function handleBreedChange(event) {
        setBreed(event.target.value);
    }

    function handleGenderChange(event) {
        setGender(event.target.value);
    }

    function handleColorChange(event) {
        setColor(event.target.value);
    }

    function handlePhotoChange(event) {
        setPhoto(event.target.files[0]);

        // Отображение превью выбранного изображения
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    function handleCommentChange(event) {
        setComment(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // Создание объекта формы со значениями полей
        const formData = new FormData();
        formData.append("newPlacemarkCoordinates", newPlacemarkCoordinates);
        formData.append("petType", petType);
        formData.append("breed", breed);
        formData.append("gender", gender);
        formData.append("color", color);
        formData.append("comment", comment);
        formData.append("phone", phone);

        if (photo) {
            // Добавление фотографии в форму, если она загружена
            formData.append("photo", photo);
        }

        // Отправка формы на сервер
        fetch("/api/submit-form", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="container">
            {page === 1 && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4">
                    <h4>Шаг 1. Опишите питомца или выберите из найденных</h4>
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="petType">Род</label>
                                <select
                                    id="pet-type"
                                    className="form-control"
                                    name="pet-type"
                                    onChange={handleTypeChange}
                                >
                                    {petTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="breed">Порода</label>
                                <select id="breed" className="form-control" name="breed">
                                    {petBreeds.map((breed) => (
                                        <option key={breed} value={breed}>
                                            {breed}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="gender">Пол</label>
                                <div className="d-flex">
                                    <select
                                        id="gender"
                                        className="form-control"
                                        name="gender"
                                        value={gender}
                                        onChange={handleGenderChange}
                                    >
                                        <option value="male">Мужской</option>
                                        <option value="female">Женский</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="color">Окрас</label>
                                <select id="color" className="form-control" name="color">
                                    {petColors.map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="petPhoto">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Фотография питомца"
                                            style={{ maxWidth:"100%" }} /> ) : (
                                        <div className="d-flex justify-content-center align-items-center"
                                             style={{ height: "120px",
                                                 width: "120px",
                                                 marginLeft: "2rem", border: "1px dashed #ccc",
                                                 cursor: "pointer", }} >
                                            <img src={"/cat.svg"} alt="img" />
                                        </div> )} </label>
                                <input type="file" className="d-none" id="petPhoto" onChange={handlePhotoChange} /> </div> </div> </div> <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="comment">Комментарий</label>
                            <textarea id="comment" className="form-control" rows="3"
                                      value={comment} onChange={handleCommentChange} placeholder="Общая информация о вашем питомце..." />
                        </div>
                    </div>
                </div>

                    <div className="row justify-content-center mt-3">
                        <div className="col-sm-4 text-center">
                            <button type="button" className="btn previous-btn" onClick={() => setPage(0)}>
                                Предыдущий шаг
                            </button>
                        </div>
                        <div className="col-sm-4 text-center">
                            <button
                                type="button"
                                className="btn next-btn"
                                style={{ background: "#FD6A49", color: "wheat" }}
                                onClick={() => setPage(2)}
                            >
                                Следующий шаг
                            </button>
                        </div>
                    </div>
                </form>
            )}
            {page === 2 && (
                <form onSubmit={handleSubmit} className="my-form rounded-lg p-6">
                    <h3>Шаг 2. Выберите место, где потерялся питомец</h3>
                    <div className="row justify-content-center">
                        <div className="col-sm-4 text-center">
                            <button
                                type="submit"
                                className="btn next-btn"
                                style={{ background: "#FD6A49", color: "wheat" }}
                                onClick={() => setPage(3)}
                            >
                                Следующий шаг
                            </button>
                        </div>
                    </div>
                </form>

            )}
            {page === 3 && (
                <form onSubmit={handleSubmit} className="my-form p-6 d-flex flex-column w-100">
                    <h4 className="align-self-center">Шаг 3. Укажите свой телефон для связи</h4>
                    <div className="form-group mr-6 d-flex align-items-center">
                        <label htmlFor="phoneInput" className="mr-2">Телефон:</label>
                        <PhoneInput
                            inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: true,
                            }}
                            className="flex-grow-1"
                            placeholder="+7 --- --- -- --"
                            country="ru"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>

                    <div className="row justify-content-center mt-3">
                        <div className="col-sm-6 text-center">
                            <button type="submit" className="btn next-btn" style={{color:"wheat",
                                background:"#FD6A49"}}
                            onClick={handleSubmit}
                            >
                                Сохранить заявку
                            </button>
                        </div>
                    </div>
                </form>

            )}
        </div>
    );
}

export default PetForm;
