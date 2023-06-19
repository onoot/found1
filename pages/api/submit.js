import { Ad, Coordinate } from './database/user';
import { Op } from 'sequelize';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formData = req.body;
        const { lat1, lon1, lat2, lon2, isLostPet, buttonType } = formData;

        try {
            const ads = await Ad.findAll({
                include: {
                    model: Coordinate,
                    where: {
                        latitude: { [Op.between]: [lat1, lat2] },
                        longitude: { [Op.between]: [lon1, lon2] },
                    },
                },
                where: {
                    missing: isLostPet,
                },
            });

            if (ads.length > 0) {
                if (buttonType === 'lost') {
                    const foundAds = ads.filter(ad => !ad.status);
                    res.status(200).json(foundAds);
                } else if (buttonType === 'found') {
                    const lostAds = ads.filter(ad => ad.status);
                    res.status(200).json(lostAds);
                } else {
                    res.status(400).json({ message: 'Неизвестный тип кнопки' });
                }
            } else {
                res.status(404).json({ message: `Объявлений в данном диапазоне координат не найдено` });
            }
        } catch (error) {
            console.log('Ошибка при обработке запроса:', error);
            res.status(500).json({ message: 'Ошибка на сервере' });
        }
    } else if (req.method === 'GET') {
        try {
            const ads = await Ad.findAll();
            res.status(200).json(ads);
        } catch (error) {
            console.log('Ошибка при обработке запроса:', error);
            res.status(500).json({ message: 'Ошибка на сервере' });
        }
    } else {
        res.status(405).json({ message: 'Метод не поддерживается' });
    }
};
