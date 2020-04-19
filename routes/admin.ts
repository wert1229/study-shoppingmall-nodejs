import express from 'express';
import csurf from 'csurf';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import models from '../models';

const router = express.Router();

//csurf
const csurfProtection = csurf({ cookie: true });

//이미지 저장되는 위치 설정
const uploadDir = path.join(__dirname, '../uploads'); // 루트의 uploads위치에 저장한다.

//multer 셋팅
const storage = multer.diskStorage({
    destination: (req, file, callback) => { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename: (req, file, callback) => { // products-날짜.jpg(png) 저장
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});

const upload = multer({ storage: storage });

router.get('/', (_, res) => {
    res.send('admin app');
});

router.get( '/products' , async (_, res) => {
    const products = await models.Products.findAll();

    res.render( 'admin/products.html', { products : products });
});

router.get('/products/detail/:id' , async (req, res) => {
    const product = await models.Products.findOne({
        where : {
            id : req.params.id
        },
        include : [{
           model: models.ProductsMemo,
           as: 'Memo'
        }]
    });

    res.render('admin/detail.html', { product: product });
});

router.get('/products/write', csurfProtection, (req, res) => {
    res.render('admin/form.html', { csrfToken : req.csrfToken() });
});

router.post('/products/write', upload.single('thumbnail'), csurfProtection, async (req, res) => {
    try { 
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        await models.Products.create(req.body);

        res.redirect('/admin/products');
    } catch(e) {

    }
});

router.get('/products/edit/:id' , csurfProtection, async (req, res) => {
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    const product = await models.Products.findByPk(req.params.id);

    res.render('admin/form.html', { product: product, csrfToken: req.csrfToken() });
});

router.post('/products/edit/:id' , upload.single('thumbnail'), csurfProtection, async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        
        if(req.file && product.thumbnail) {  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }

        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;
        await models.Products.update(
            {
                name : req.body.name,
                price : req.body.price,
                thumbnail : req.body.thumbnail,
                description : req.body.description
            }, 
            { 
                where : { id: req.params.id } 
            }
        );

        res.redirect('/admin/products/detail/' + req.params.id );
    } catch(e) {

    }
});

router.get('/products/delete/:id', async (req, res) => {
    await models.Products.destroy({
        where: {
            id: req.params.id
        }
    });

    res.redirect('/admin/products');
});

router.post('/products/detail/:id' , async(req, res) => {
    try{
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);  
    }catch(e){
        console.log(e)
    }
});

router.get('/products/delete/:product_id/:memo_id', async(req, res) => {

    try{

        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect('/admin/products/detail/' + req.params.product_id );

    }catch(e){

    }

});

export default router;