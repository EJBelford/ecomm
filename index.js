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
//         28: Production-Grade Authentication
//         29: Structuring Javascript Projects
// Lesson: 398
//
//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
// NOTES: 
//------------------------------------------------------------------------------
// 
// 
// apt list --upgradable
// sudo apt upgrade
// 
// nodejs.org/api 
// node --inspect-brk <prjctNm>
// 
// npm install chalk@4.1.2
// npm install express
// npm install nodemon
// npm install cookie-session
// npm install express-validator
//
// clear && npm run dev
// To stop: <CRTL>-C
//
// http://localhost:3000/
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
const bodyParser    = require('body-parser');
const chalk         = require('chalk');
const cookieSession = require('cookie-session');
const express       = require('express');

const authRouter    = require('./routes/admin/auth');

const prjctNm = "eComm"
const debug   = 1;    // 0: Off   1: On
const err     = 0; 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ['nfdvaw3e4rfdqvafnv399d']
    })
);
app.use(authRouter);

if (debug > 0) {
    console.log(chalk.yellow('DEBUG: ') + 'Hi there from ' + prjctNm + '!');

    if (err) {
        if (debug > 0) {
            console.log(chalk.red('ERROR: ') + err);
            // throw new Error(err);
        };
    };
};

app.listen(3000, ()=> {
    console.log(chalk.yellow('DEBUG: ') + prjctNm + ' is listening!');
});
