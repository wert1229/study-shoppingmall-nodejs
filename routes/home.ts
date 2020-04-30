import express from 'express';
import models from '../models';

const router = express.Router();

/* GET home page. */
router.get('/', async ( _ ,res) => {
    const products = await models.Products.findAll({
        include : [
            {
                model : models.User ,
                as : 'Owner',
                attributes : [ 'username' , 'displayname' ]
            },
        ]
    });
    // console.log(models.Products.findAll())
    res.render( 'home.html' , { products });
});

export default router;