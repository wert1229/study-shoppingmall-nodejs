import Sequelize from 'sequelize';
import moment from 'moment';

interface IProductAttributes {
    id?: number;              // id is an auto-generated UUID
    name: string;
    thumbnail: string;   
    price: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IProductInstance extends Sequelize.Instance<IProductAttributes>, IProductAttributes {
    prototype: {
        dateFormat: (date: string) => string;
    };
}

interface IProductModel extends Sequelize.Model<IProductInstance, IProductAttributes> {
    prototype?: {
        dateFormat: (date: string) => string;
    };
}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
    const Products: IProductModel = sequelize.define<IProductInstance, IProductAttributes>('Products',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name : { type: DataTypes.STRING },
            thumbnail : { type: DataTypes.STRING },
            price : { type: DataTypes.INTEGER },
            description : { type: DataTypes.TEXT }
        }
    );
    
    Products.associate = (models) => {
        Products.hasMany(models.ProductsMemo, {
            as: 'Memo',
            foreignKey: 'product_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
    };

    Products.prototype!.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Products;
}