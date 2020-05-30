const models = require('../../models');

exports.get_product = async(req, res) => {
    try{
        const product = await models.Products.findOne({
            where: { id: req.params.id },
            include: [
                { model: models.Tag, as: 'Tag' }
            ],
            order: [
                ['Tag', 'createdAt', 'desc']
            ]
        });
        
        // 좋아요 내용을 가져온다
        const userLikes = await require('../../helpers/userLikes')(req);

        res.render('products/detail.html', { product, userLikes });  
    }catch(e){
        console.log(e);
    }
};

exports.post_like = async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);

        const status = await user.addLikes(product);

        res.json({
            status
        })
    } catch (e) {
        console.log(e);
    }
};

exports.delete_like = async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);

        await user.removeLikes(product);
        
        res.json({
            message : "success"
        });
    } catch (e) {
        console.log(e);
    }
};