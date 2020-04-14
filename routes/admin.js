const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (_,res) => {
    res.send('admin app');
});

router.get( '/products' , (_, res) => {
    models.Products.findAll({

    }).then((products) => {
        // DB에서 받은 products를 products변수명으로 내보냄
        res.render( 'admin/products.html', { products : products });
    });
});

router.get('/products/detail/:id' , (req, res) => {
    models.Products.findByPk(req.params.id).then( (product) => {
        res.render('admin/detail.html', { product: product });  
    });
});

router.get('/products/write', (_, res) => {
    res.render('admin/form.html');
});

router.post('/products/write' , (req, res) => {
    models.Products.create(req.body).then( () => {
        res.redirect('/admin/products');
    });
});

router.get('/products/edit/:id' , (req, res) => {
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    models.Products.findByPk(req.params.id).then( function(product){
        res.render('admin/form.html', { product : product });
    });
});

router.post('/products/edit/:id' , (req, res) => {

    models.Products.update(
        {
            name : req.body.name,
            price : req.body.price ,
            description : req.body.description
        }, 
        { 
            where : { id: req.params.id } 
        }
    ).then( () => {
        res.redirect('/admin/products/detail/' + req.params.id );
    });

});

module.exports = router;