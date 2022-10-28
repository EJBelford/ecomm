const express               = require('express');
// const { validationResult } = require('express-validator');
const multer                = require('multer');

const { handleErrors }      = require('./middlewares');
const productsRepo          = require('../../repositories/products');
const productsNewTemplate   = require('../../views/admin/products/new');
const procuctsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(procuctsIndexTemplate({ products: products}));
});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new', 
  upload.single('image'), 
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    /* const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(productsNewTemplate({ errors }));
    }; */

    // console.log(errors);
    // console.log(req.body);

    /* req.on('data', data => {
        console.log(data.toString());
    }); */

    // console.log(req.file.buffer.toString('base64'));
    
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    
    // res.send('Submitted!');
    res.redirect('/admin/products');
});

module.exports = router;
