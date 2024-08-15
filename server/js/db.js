const fs = require('fs');

let path = './server/db';
class DevankaDataBase {
  constructor() {
    this.ref = {users:{},barang:{},privs:{}}
  }
  load() {
    Object.keys(this.ref).forEach(dbpath => {
      if(!fs.existsSync(`${path}/${dbpath}.json`)) fs.writeFileSync(`${path}/${dbpath}.json`, JSON.stringify(this.ref[dbpath]), 'utf-8');

      let filebuffer = fs.readFileSync(`${path}/${dbpath}.json`, 'utf-8');

      this.ref[dbpath] = JSON.parse(filebuffer);
      console.log(`${dbpath} data loaded!`);
    });
  }
  overwrite(dbpath) {
    fs.writeFileSync(`${path}/${dbpath}.json`, JSON.stringify(this.ref[dbpath]));
  }
  save(dbspath) {
    if(typeof dbspath  == 'string') dbspath = [dbspath];
    dbspath.forEach(dbpath => this.overwrite(dbpath));
  }
}

module.exports = new DevankaDataBase();