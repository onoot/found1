const { Pet, Breed, Color } = require("./database/user");

function submitForm(req, res) {
    const {
        newPlacemarkCoordinates,
        petType,
        breed,
        gender,
        color,
        comment,
        phone,
    } = req.body;

    // Найдем породу и цвет в базе данных
   Breed.findOne({ where: { name: breed } })
        .then((breedObj) => {
            Color.findOne({ where: { name: color } })
                .then((colorObj) => {
                    // Создание записи животного
                    Pet.create({
                        name: petType,
                        gender: gender,
                        description: comment,
                        latitude: newPlacemarkCoordinates.latitude,
                        longitude: newPlacemarkCoordinates.longitude,
                        breedId: breedObj.id,
                        colorId: colorObj.id,
                    })
                        .then((animal) => {
                            // Создание записи пользователя
                            User.create({})
                                .then((userObj) => {
                                    // Создание записи телефона
                                    Phone.create({ number: phone })
                                        .then((phoneObj) => {
                                            // Создание записи объявления
                                            Ad.create({
                                                date: new Date(),
                                                missing: false,
                                                status: true,
                                                petId: animal.id,
                                                cityId: 1, // предполагается, что значение 1 - это ID города в базе данных
                                                phoneId: phoneObj.id,
                                                userId: userObj.id,
                                            })
                                                .then((ad) => {
                                                    // возвращаем успешный ответ
                                                    res.status(200).json({ success: true });
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                    res.status(500).json({ message: "Ошибка создания записи объявления" });
                                                });
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            res.status(500).json({ message: "Ошибка создания записи телефона" });
                                        });
                                })
                                .catch((error) => {
                                    console.error(error);
                                    res.status(500).json({ message: "Ошибка создания записи пользователя" });
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).json({ message: "Ошибка создания записи животного" });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(404).json({ message: `Цвет ${color} не найден в базе данных` });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(404).json({ message: `Порода ${breed} не найдена в базе данных` });
        });
}

module.exports = submitForm;
