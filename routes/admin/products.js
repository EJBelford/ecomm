const chalk                 = require('chalk');
const express               = require('express');
// const { validationResult } = require('express-validator');
const multer                = require('multer');

const { handleErrors, requireAuth }  = require('./middlewares');
const { requireTitle, requirePrice } = require('./validators');

const productsRepo          = require('../../repositories/products');
const productsNewTemplate   = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate  = require('../../views/admin/products/edit');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products: products}));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new', 
  requireAuth, 
  upload.single('image'), 
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    
    res.redirect('/admin/products');
  }
);

router.get(
    '/admin/products/edit', 
    requireAuth,     
    async (req, res) => {
        console.log(chalk.yellow('DEBUG: Products: getOne: ') + req.params.id);
        const product = await productsRepo.getOne(req.params.id);
    
        if (!product) {
        return res.send('Product not found');
        }
    
        res.send(productsEditTemplate({ product }));
});

router.post(
    '/admin/products/edit/:id', 
    requireAuth, 
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        console.log(chalk.yellow('DEBUG: Products: edit: ') + req.params.id);
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        };

        try {
            await productsRepo.update(req.params.id, changes);
        } catch (err) {
            return res.send('Could not find item!');
        };

        res.redirect('admin/products');
    }
);

router.post(
    '/admin/products/delete/:id', 
    requireAuth, 
    [requireTitle, requirePrice], 
    async (req, res) => {
        console.log(chalk.yellow('DEBUG: Products: delete: ') + req.params.id);
        try {
            await products.delete(req.params.id); 
        } catch(err) {
            return res.send('Could not find item! ' + req.params.id);
        }

        res.redirect('/admin/products');
    }
);

module.exports = router;
