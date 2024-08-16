const db = require("../db")

module.exports = {
  getUser(user_id) {
    return {code:200,msg:'ok',data:{email: db.ref.users[user_id].email,name: db.ref.users[user_id].name,id:user_id}}
  },
  initial() {
    const udb = db.ref.users;
    const users = Object.keys(udb).map(k => {
      return { id: k, name: udb[k].name}
    });

    return { users, items:db.ref.items, fees:db.ref.fees }
  },
  workItem(s, user_id) {
    if(typeof s?.worktype !== 'number') return {code:400,msg:'Terjadi kesalahan - CXG7001'};

    if(s.worktype === 2) {
      if(typeof s?.workid !== 'string') return {code:400,msg:'Terjadi kesalahan - CXG70010'};
      if(!db.ref.items[s.workid]) return {code:400,msg:'Barang ini sudah dihapus sebelumnya - CXG7011'};
      delete db.ref.items[s.workid];
      db.save('items');
      return {code:200,msg:'ok',data:{id:s.workid}}
    }
    
    if(typeof s?.item_name !== 'string') return {code:400,msg:'Silakan isi nama barang - CXG7002'};
    if(typeof Number(s?.item_type) !== 'number') return {code:400,msg:'Terjadi kesalahan - CXG7003'};
    s.item_type = Number(s.item_type);
    if(typeof s?.item_price !== 'string') return {code:400,msg:'Silakan masukkan harga barang - CXG7004'};
    s.item_price = Number(s.item_price.replace(/\D/g, ""));
    if(s.item_desc && typeof s?.item_desc !== 'string') return {code:400,msg:'Terjadi kesalahan - CXG7005'};

    let item_id = null;
    if(s.worktype === 0) {
      item_id = Date.now().toString(32);
      if(!db.ref.items[item_id]) db.ref.items[item_id] = {};
    } else if(s.worktype === 1) {
      if(typeof s?.workid !== 'string') return {code:400,msg:'Terjadi kesalahan - CXG7006'};
      if(!db.ref.items[s.workid]) return {code:400,msg:'Barang ini sudah tidak ada - CXG7007'};
      item_id = s.workid;
    }

    db.ref.items[item_id].name = s.item_name;
    db.ref.items[item_id].type = s.item_type;
    db.ref.items[item_id].price = s.item_price;
    if(!db.ref.items[item_id].last) db.ref.items[item_id].last = [];
    db.ref.items[item_id].last.push([user_id, Date.now(), s.item_price]);
    if(s.item_desc) db.ref.items[item_id].desc = s.item_desc;
    db.save('items');
    return {code:200,msg:'ok',data:{...db.ref.items[item_id],id:item_id}}
  },
  getAppUpdate(s) {
    if(!s || typeof s?.version !== 'string' || typeof s?.build !== 'string') return {code:400,msg:'Error Reading App Build Number!'};

    let lastApp = db.ref.apps[db.ref.apps.length - 1];

    // let appdemo = {
    //   id:"lalala",
    //   version: "1.0.0",
    //   build: "76.1.22",
    //   link: 'https://tokoku.devanka.id/file/app/download/tokoku_v1.0.0.apk'
    // }

    if(s.version !== lastApp.version || s.build !== lastApp.build) {
      return {code:200,msg:'Harap update app ini untuk mendapatkan fitur terbaru dan perbaikan error',data:{url:lastApp.link}};
    }

    return{code:400,msg:'Tidak ada update terbaru'};
  }
}