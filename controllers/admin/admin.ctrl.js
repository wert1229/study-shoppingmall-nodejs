const paginate = require('express-paginate');
const fs = require('fs');

const models = require('../../models');

exports.index = ( _ ,res) => {
    res.send('admin app');
};

exports.get_products = async (req, res) => {
    try{
        const [ products, totalCount ] = await Promise.all([
            models.Products.findAll({
                include: [
                    {
                        model: models.User ,
                        as: 'Owner',
                        attributes: [ 'username', 'displayname' ]
                    },
                ],
                limit: req.query.limit,
                offset: req.offset,
                order: [
                    ['createdAt', 'asc']
                ]
            }),
            models.Products.count()
        ]);

        const pageCount = Math.ceil(totalCount / req.query.limit);
    
        const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);

        res.render('admin/products.html', { products, pages, pageCount });
    }catch(e){
        console.log(e);
    }
};

exports.get_detail = async (req, res) => {
    const product = await models.Products.findOne({
        where : {
            id : req.params.id
        },
        include : [
            'Memo'
        ]
    });

    res.render('admin/detail.html', { product: product });
};

exports.get_write = (req, res) => {
    res.render('admin/form.html', { csrfToken : req.csrfToken() });
};

exports.post_write = async (req, res) => {
    try { 
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        
        const user = await models.User.findByPk(req.user.id);
        await user.createProduct(req.body);
        
        res.redirect('/admin/products');
    } catch(e) {
        console.log(e);
    }
};

exports.get_edit = async (req, res) => {
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    const product = await models.Products.findByPk(req.params.id);

    res.render('admin/form.html', { product: product, csrfToken: req.csrfToken() });
};

exports.post_edit = async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        
        if (req.file && product.thumbnail) {  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync(uploadDir + '/' + product.thumbnail);
            fs.unlinkSync(uploadDir + '/thumb/' + product.thumbnail);
        }

        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;

        await models.Products.update({
                name: req.body.name,
                price: req.body.price,
                thumbnail: req.body.thumbnail,
                description: req.body.description
            }, { 
                where: { id: req.params.id } 
            }
        );

        res.redirect('/admin/products/detail/' + req.params.id);
    } catch(e) {
        console.log(e);
    }
};

exports.get_delete = async (req, res) => {
    await models.Products.destroy({
        where: {
            id: req.params.id
        }
    });

    res.redirect('/admin/products');
};

exports.post_delete = async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);  
    } catch(e) {
        console.log(e)
    }
};

exports.get_delete_memo = async (req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });

        res.redirect('/admin/products/detail/' + req.params.product_id);
    } catch(e) {
        console.log(e);
    }
};

exports.post_summernote = (req, res) => {
    res.send('/uploads/' + req.file.filename);
};