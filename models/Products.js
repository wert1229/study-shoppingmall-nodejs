const moment = require('moment');

module.exports = function(sequelize, DataTypes){
    var Products = sequelize.define('Products',
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

        Products.belongsTo(models.User, { as :'Owner',  foreignKey: 'user_id', targetKey: 'id'} );
    };

    Products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Products;
}