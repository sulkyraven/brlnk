const db = require('../db');
const { fixedNumber } = require('../helper');

module.exports = {
  login(s) {
    if(typeof s?.email !== 'string') return {code:400,msg:'Masukkan alamat email kamu - CXG7001'};

    let ukey = Object.keys(db.ref.users).find(key => db.ref.users[key].email == s.email);
    if(!ukey) return {code:400,msg:`Akun dengan email\n${s.email}\ntidak ada dalam database kami`};

    let existOTP = db.ref.users[ukey].otp;
    let newOTP = null;
    if(existOTP?.code && existOTP?.expiry >= Date.now()) {
        newOTP = existOTP.code;
    } else {
      newOTP = fixedNumber();
      db.ref.users[ukey].otp = { code: newOTP, expiry: Date.now() + (1000 * 60 * 15) }
      db.save('users');
    }

    return {code:200,msg:'ok',data:{step:1,email:s.email,id:ukey}}
  },
  verify(s) {
    if(typeof s?.email !== 'string') return {code:400,msg:'Masukkan alamat email kamu - CXG7001'};
    if(typeof Number(s?.code) !== 'number' || s?.code?.toString().length !== 6) return {code:400,msg:'Masukkan kode OTP 6 Digit yang dikirimkan ke email - CXG7002'};

    let ukey = Object.keys(db.ref.users).find(key => db.ref.users[key].email == s.email);
    if(!ukey) return {code:400,msg:`Akun dengan email\n${s.email}\ntidak ada dalam database kami`};

    let existOTP = db.ref.users[ukey].otp;

    if(existOTP?.code && existOTP?.expiry < Date.now()) return {code:404,msg:`OTP ini telah kadaluarsa atau terlewat batas pemakaiannya.\nSilakan login ulang.`}
    if(Number(s.code) !== existOTP.code) return {code:404,msg:'GAGAL!\nOTP ini tidak cocok dengan akun manapun.'}

    delete db.ref.users[ukey].otp;
    db.save('users');

    return {code:200,msg:'ok',data:{step:2,user:{email:s.email,id:ukey,name:db.ref.users[ukey].name}}}
  }
}

function sendOTP() {}