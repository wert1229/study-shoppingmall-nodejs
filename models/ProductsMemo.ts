import Sequelize from 'sequelize';
import moment from 'moment';

interface IProductMemoAttributes {
    id?: number;              // id is an auto-generated UUID
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IProductMemoInstance extends Sequelize.Instance<IProductMemoAttributes>, IProductMemoAttributes {
    prototype: {
        dateFormat: (date: string) => string;
    };
}

interface IProductMemoModel extends Sequelize.Model<IProductMemoInstance, IProductMemoAttributes> {
    prototype?: {
        dateFormat: (date: string) => string;
    };
}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
    const ProductsMemo: IProductMemoModel = sequelize.define<IProductMemoInstance, IProductMemoAttributes>('ProductsMemo',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            content :  { 
                type: DataTypes.TEXT,
                validate : {
                    len : [0, 500],
                } 
            }
        },{
            tableName: 'ProductsMemo'
        }
    );
    
    ProductsMemo.prototype!.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // h:mm')
    );

    return ProductsMemo;
}