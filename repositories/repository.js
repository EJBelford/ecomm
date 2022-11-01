const chalk          = require('chalk');
const crypto = require('crypto');
const fs     = require('fs');

module.exports = class Repository {
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

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

        return attrs;
    };

    async getAll() {
        console.log(chalk.yellow('DEBUG: REPO: getAll: '));
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

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2),      {encoding: 'utf8'});
    };

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    };

    async getOne(id) {
        console.log(chalk.yellow('DEBUG: REPO: getOne: ') + id);
        const records = await this.getAll();
        return records.find(record => record.id === id);
      }
    
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