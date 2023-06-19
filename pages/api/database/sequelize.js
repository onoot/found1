import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    'ecitya52_ecitya5',
    'ecitya52_ecitya5',
    'B57tIDT8',
    {
        host: process.env.DB_HOST || 'ecitya52.beget.tech',
        dialect: 'mysql',
        dialectOptions: {
            ssl: false,
        },
        logging: false //опция, которая отключает логгирование SQL-запросов
    }
);

// Создание и синхронизация таблиц в базе данных
sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((error) => {
        console.error(`An error occurred while synchronizing the models: ${error.message}`);
    });
