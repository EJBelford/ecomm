//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 26: E-Commerce App
// Lesson: 355
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
// npm run dev
// To stop: <CRTL>-C
//
// http://localhost:3000/
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
const chalk     = require('chalk');
const express   = require('express');

const prjctNm = "eComm"
const debug   = 1;    // 0: Off   1: On
const err     = 0; 

const app = express();

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
    res.send('Hi theres from ' + prjctNm + ' server!');
});

app.listen(3000, ()=> {
    console.log(chalk.yellow('DEBUG: ') + prjctNm + ' is listening!');
})
