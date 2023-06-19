import data from './data.json' // Подставьте вместо этой строки код для получения данных из вашей базы данных

export default function searchAds(req, res) {
    const animal = req.query.animal; // Получаем выбранное животное из запроса
    const status = req.query.status; // Получаем выбранный статус из запроса

    const filteredAds = data.filter(ad => ad.animal === animal && ad.status === status) // Фильтруем объявления по выбранным животному и статусу

    res.status(200).json(filteredAds) // Отправляем отфильтрованные объявления в ответ на запрос
}
