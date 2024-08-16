const fs = require('fs');
const db = require('../db');
const { fixedNumber } = require('../helper');
const nodemailer = require('nodemailer');

module.exports = {
  login(s) {
    if(typeof s?.email !== 'string') return {code:400,msg:'Masukkan alamat email kamu - CXG7001'};
    let mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(!s.email.match(mailRegex)) return {code:400, msg: "Email yang kamu tulis gak valid"};

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

    // sendOTP(s.email, newOTP);
    return {code:200,msg:'ok',data:{step:1,email:s.email,id:ukey}}
  },
  verify(s) {
    if(typeof s?.email !== 'string') return {code:400,msg:'Masukkan alamat email kamu - CXG7001'};
    let mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(!s.email.match(mailRegex)) return {code:400, msg: "Email yang kamu tulis gak valid"};

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

function sendOTP(user_email, user_otp) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  let email_file = fs.readFileSync('./server/html/email_otp.txt', 'utf8').replace(/{GEN_CODE}/g, user_otp);

  transport.sendMail({
    from: `"Login Akun | Tokoku" <${process.env.SMTP_USER}>`,
    to: user_email,
    subject: "Kode Verifikasi Login Tokoku",
    html: email_file
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    transport.close();
  });
}