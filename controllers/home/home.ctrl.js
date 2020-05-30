const models = require('../../models');

exports.index = async (req, res) => {
    const products = await models.Products.findAll({
        include: [
            {
                model: models.User,
                as: 'Owner',
                attributes: ['username' , 'displayname']
            },
            {
                model: models.Tag,
                as: 'Tag'
            }
        ],
        where: {
            ...(
                ('name' in req.query && req.query.name) ? 
                {
                    [models.Sequelize.Op.or]: [
                        models.Sequelize.where(models.Sequelize.col('Tag.name'), {
                            [models.Sequelize.Op.like]: `%${req.query.name}`
                        }),
                        {
                            'name': {
                                [models.Sequelize.Op.like]: `%${req.query.name}`
                            }
                        }
                    ]
                }
                : ''
            )
        }
    });
    // TODO 쿼리에 포함시키기
    // 좋아요 내용을 가져온다
    const userLikes = await require('../../helpers/userLikes')(req);

    res.render('home.html', { products, userLikes });
};