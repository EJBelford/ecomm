//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
// NOTES: 
//------------------------------------------------------------------------------
// 
// clear && npm run dev
// To stop: <CRTL>-C
//
// http://localhost:3000/
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/

const express        = require('express');
// const { check, validationResult }      = require('express-validator');

const { handleErrors }     = require('./middlewares');
const usersRepo      = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, 
        requirePassword, 
        requirePasswordConfirmation,
        requiredEmailExists,
        requireValidPasswordForUser } = require('./validators.js');

const router  = express.Router();

router.get('/signup', (req, res) => {
    // res.send('Hi theres from ' + prjctNm + ' server!');
    res.send(signupTemplate({ req: req }));
});

/* const bodyParser = (req, res, next) => { 
    console.log('====================');
    
    if (req.method === 'POST') {
        req.on('data', data => {
            // console.log(chalk.yellow('DEBUG: Data: ') + data);
            const parsed = data.toString('utf8').split('&');
            // console.log(chalk.yellow('DEBUG: Parsed: ') + parsed);
            const formData = {};
            for (let pair of parsed) {
                // console.log(chalk.yellow('DEBUG: ') + pair);
                const [key, value] = pair.split("=");
                // console.log(chalk.yellow('DEBUG: Pair: ') + [key, value]);
                formData[key] = value;
            };
            console.log(formData);
            req.body = formData;
            next();
        });
    } else {
        next();
    };
}; */

router.post('/signup', [
    requireEmail, 
    requirePassword,
    requirePasswordConfirmation
    ], 
    handleErrors(signupTemplate),
    async (req, res) => {
        /* const errors = validationResult(req);
        // console.log(errors);
        
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }; */

        // console.log(req.body);
        const { email, password } = req.body;
        const user = await usersRepo.create( { email: email, password: password } );

        req.session.userId = user.id; 

        // res.send('Account created!');
        res.redirect('/admin/products');
    }
);

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out.');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [
        requiredEmailExists,
        requireValidPasswordForUser
    ], 
    handleErrors(signinTemplate), 
    async (req, res) => {
        /* const errors = validationResult(req);
        // console.log(errors);

        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors: errors }));
        } */

        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email: email });

        req.session.userId = user.id;

        // res.send('You are signed in!');
        res.redirect('/admin/products');
    }
);
 
module.exports = router;
