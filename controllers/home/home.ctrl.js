const models = require('../../models');

exports.index = async ( _ , res) => {
    const products = await models.Products.findAll({
        include: [
            {
                model: models.User,
                as: 'Owner',
                attributes: ['username' , 'displayname']
            },
        ]
    });
    
    res.render('home.html', { products });
};