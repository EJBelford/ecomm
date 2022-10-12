//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 26: E-Commerce App
//         27: Design a Custon Database
// Lesson: 362
//
//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
// NOTES: 
//------------------------------------------------------------------------------
// 
// nodejs.org/api 
// node --inspect-brk <prjctNm>
// 
// npm install chalk@4.1.2
// npm install express
// npm install nodemon
//
// clear && npm run dev
// To stop: <CRTL>-C
//
// http://localhost:3000/
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
const bodyParser = require('body-parser');
const chalk      = require('chalk');
const express    = require('express');

const usersRepo = require('./repositories/users');

const prjctNm = "eComm"
const debug   = 1;    // 0: Off   1: On
const err     = 0; 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

if (debug > 0) {
    console.log(chalk.yellow('DEBUG: ') + 'Hi there from ' + prjctNm + '!');

    if (err) {
        if (debug > 0) {
            console.log(chalk.red('ERROR: ') + err);
            // throw new Error(err);
        };
    };
};

// Router  

app.get('/', (req, res) => {
    // res.send('Hi theres from ' + prjctNm + ' server!');
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
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

app.post('/', async (req, res) => {
    // console.log(req.body);
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email});
    if (existingUser) {
        return res.send('Email already in use.');
    };

    if (password !== passwordConfirmation) {
        return res.send('Passwords most match.');
    }

    res.send('Account created!');
});

app.listen(3000, ()=> {
    console.log(chalk.yellow('DEBUG: ') + prjctNm + ' is listening!');
});
