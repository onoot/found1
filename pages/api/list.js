import { Animal, Breed, Species, Color } from "./database/user";

export default async function handler(req, res) {
    try {
        // Запрос к БД на получение списка всех животных
        const animals = await Animal.findAll({
            include: [Breed, Species, Color],
        });

        const petTypes = ["Не выбрано"]; // Массив со списком Родов
        const petBreeds = ["Не выбрано"]; // Массив со списком Пород
        const petColors = ["Не выбрано"]; // Массив со списком Окрасов

        // Создаем список доступных Родов животных из полученных из БД данных
        animals.forEach((animal) => {
            const { Species } = animal;
            if (!petTypes.includes(Species.name)) {
                petTypes.push(Species.name);
            }
        });

        // Формируем ответ сервера в формате JSON
        const response = {
            petTypes,
            petBreeds,
            petColors,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
