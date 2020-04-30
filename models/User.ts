import Sequelize from 'sequelize';
import passwordHash from '../helpers/passwordHash';
import Products from './Products';

interface IUserAttributes {
    id?: number;              // id is an auto-generated UUID
    username: string;
    password: string;   
    displayname: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IUserInstance extends Sequelize.Instance<IUserAttributes>, IUserAttributes {}

interface IUserModel extends Sequelize.Model<IUserInstance, IUserAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
    const User: IUserModel = sequelize.define<IUserInstance, IUserAttributes>('User',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            username : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false
            },
            
            password : { 
                type: DataTypes.STRING,
                validate : {
                    len : [3, 100]
                } ,
                allowNull : false
            },
            
            displayname : { type: DataTypes.STRING }

        },{
            tableName: 'User'
        }
    );
        
    User.associate = (models) => {
        User.hasMany(models.Products, {
            as: 'Product',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
    };

    User.beforeCreate((user, _) => {
        user.password = passwordHash(user.password);
    });

    return User;
}