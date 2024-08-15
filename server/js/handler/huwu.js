const db = require("../db")

module.exports = {
  getUser(user_id) {
    return {code:200,msg:'ok',data:{...db.ref.users[user_id],id:user_id}};
  },
  getBarang() {
    const data = Object.keys(db.ref.barang).map(k => {return{...db.ref.barang[k],id:k}});

    return {code:200,msg:'ok',data}
  },
  getPrivs() {
    const data = Object.keys(db.ref.privs).map(k => {return {...db.ref.privs[k], id:k}});

    return {code:200,msg:'ok',data}
  },
  workBarang(s) {
    if(typeof s?.worktype !== 'number') return {code:400,msg:'Terjadi kesalahan - CXG7001'};

    if(s.worktype === 2) {
      if(typeof s?.workid !== 'string') return {code:400,msg:'Terjadi kesalahan - CXG70010'};
      if(!db.ref.barang[s.workid]) return {code:400,msg:'Barang ini sudah dihapus sebelumnya - CXG7011'};
      delete db.ref.barang[s.workid];
      db.save('barang');
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
      if(!db.ref.barang[item_id]) db.ref.barang[item_id] = {};
    } else if(s.worktype === 1) {
      if(typeof s?.workid !== 'string') return {code:400,msg:'Terjadi kesalahan - CXG7006'};
      if(!db.ref.barang[s.workid]) return {code:400,msg:'Barang ini sudah tidak ada - CXG7007'};
      item_id = s.workid;
    }

    db.ref.barang[item_id].name = s.item_name;
    db.ref.barang[item_id].type = s.item_type;
    db.ref.barang[item_id].price = s.item_price;
    if(s.item_desc) db.ref.barang[item_id].desc = s.item_desc;
    db.save('barang');
    return {code:200,msg:'ok',data:{...db.ref.barang[item_id],id:item_id}}
  }
}