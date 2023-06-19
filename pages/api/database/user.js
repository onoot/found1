//api/database/user.js

import { Sequelize, Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelize';

export class User extends Model {}
User.init(
    {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        profileImageUrl: DataTypes.STRING,
        password: DataTypes.STRING,
        birthday: DataTypes.DATEONLY,
        role: DataTypes.STRING,
    },
    { sequelize }
);

export class Phone extends Model {}
Phone.init(
    {
        number: DataTypes.STRING,
    },
    { sequelize }
);

export class Email extends Model {}
Email.init(
    {
        address: DataTypes.STRING,
    },
    { sequelize }
);

export class City extends Model {}
City.init(
    {
        name: DataTypes.STRING,
    },
    { sequelize }
);

export class Coordinate extends Model {}
Coordinate.init(
    {
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
    },
    { sequelize }
);

export class Animal extends Model {}
Animal.init(
    {
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        description: DataTypes.STRING,
        imageUrl: DataTypes.STRING,
    },
    { sequelize }
);

export class Breed extends Model {}
Breed.init(
    {
        name: DataTypes.STRING,
    },
    { sequelize }
);

export class Species extends Model {}
Species.init(
    {
        name: DataTypes.STRING,
    },
    { sequelize }
);

export class Color extends Model {}
Color.init(
    {
        name: DataTypes.STRING,
    },
    { sequelize }
);

export class Ad extends Model {}
Ad.init(
    {
        date: DataTypes.DATE,
        missing: DataTypes.BOOLEAN,
        status: DataTypes.BOOLEAN,
    },
    { sequelize }
);

// Relationships
User.hasOne(Phone);
User.hasOne(Email);
User.belongsTo(City);
Phone.belongsTo(User);
Email.belongsTo(User);

Ad.belongsTo(City);
Ad.belongsTo(Animal);
Ad.belongsTo(Phone);
Ad.belongsTo(Email);
Ad.belongsTo(Coordinate);

Animal.belongsTo(Breed);
Animal.belongsTo(Species);
Animal.belongsTo(Color);

Breed.hasMany(Animal);
Species.hasMany(Animal);
Color.hasMany(Animal);
