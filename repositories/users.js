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
// clear && node users.js
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
const chalk  = require('chalk');
const crypto = require('crypto');
const fs     = require('fs');

class UserRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('ERROR: Creating a repository requires a filename!');
        };

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        };
        
    };

    async getAll() {
        // Open the file referenced by <this.filename>
        // Read the file contents 
        // Parse the contents
        /* const contents = await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }); */

        // console.log(chalk.yellow('DEBUG: ') + contents); 
        // const data = JSON.parse(contents);

        // Return the parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'}));
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);       

        await this.writeAll(records);
    };

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2),      {encoding: 'utf8'});
    };

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    };

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    };

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        
        if (!record) {
            throw new Error(`Record with id ${id} not found.`);
            return;
        };

        Object.assign(record, attrs);
        await this.writeAll(records);
    };

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            };

            if (found) {
                return record;
            };
        };
    };
};

module.exports = new UserRepository('users.json');


/* // Test Cases 
//=======================

const test = async () => {
    console.log(chalk.green('TEST: '));
    
    // new UserRepository();
    const repo = new UserRepository('users.json');

    await repo.create({ email: 'test_08@test.com', password: 'test'});

    let user = await repo.getOne('f5cca141');  
    console.log('');  
    console.log( user );

    let users = await repo.getAll();
    console.log('');
    console.log( users );

    await repo.update('1347ac4d', { password: 'new_pwd_02' });
    user = await repo.getOne('1347ac4d');  
    console.log('');
    console.log( user );

    const id = 'a5eb6a51';
    await repo.delete(id);
    user = await repo.getOne(id);  
    console.log('');
    console.log( user );

    user = await repo.getOneBy({ password: 'test_01' });
    console.log('');
    console.log( user );

    user = await repo.getOneBy({ email: 'test_05@test.com', password: 'test' });
    console.log('');
    console.log( user );

    user = await repo.getOneBy({ email: 'unk', password: 'test' });
    console.log('');
    console.log( user );

    user = await repo.getOneBy({ id: '943cfa11' });
    console.log('');
    console.log( user );

    user = await repo.getOneBy({ junk: 'junk' });
    console.log('');
    console.log( user );

    console.log('');
    await repo.update('1347', { password: 'No user exists' });
};

test();
 */