import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); //LOAD CONFIG

const sequelize = new Sequelize( 
    process.env.DATABASE!, 
    process.env.DB_USER!, 
    process.env.DB_PASSWORD!, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00', //한국 시간 셋팅
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

let db: Record<string, Sequelize.Model<any, any ,any>> = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js') && file !== 'index.js'
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate!(db);
    }
});

export default db;
export { sequelize, Sequelize };