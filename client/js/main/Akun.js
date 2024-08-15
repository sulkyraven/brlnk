import elman from "../helper/elman.js";
import { modal, waittime } from "../helper/modal.js";
import xhr from "../helper/xhr.js";
import Biaya from "./Biaya.js";
import nav from "./nav.js";

export default class Akun {
  constructor({type = 'login'} = {}) {
    this.name = 'akun';
    this.type = type;
    this.isLocked = false;
  }
  createElement() {
    this.element = document.createElement('section');
    this.element.classList.add('sect', '_akun');
    document.querySelector('main').appendChild(this.element);
  }
  async initial() {
    this.element = document.querySelector('._akun');
    if(!this.element) this.createElement();
    this.element.innerHTML = `<div class="content"><p class="center">Memuat</p></div>`;
    this.content = this.element.querySelector('.content');

    const isUser = await xhr.get('/uwu/isUser');
    await waittime(750);
    this.content.innerHTML = '';
    if(!isUser || isUser.code !== 200) return this.makeLogin();
    return this.makeUser(isUser.data);
  }
  makeUser(user) {
    this.type = 'signout';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/signout';
    this.form.innerHTML = `
    <div class="akun-title"><p>AKUN</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="username">Nama:</label></p>
        <input type="text" name="username" id="username" value="${user.name || 'error'}" readonly/>
      </div>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" value="${user.email || 'err@error.err'}" readonly/>
      </div>
      <div class="field">
        <button class="btn logout" type="submit">KELUAR AKUN</button>
      </div>
    </div>`;
    this.content.append(this.form);
    this.formListener();
  }
  makeLogin() {
    this.type = 'login';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/login';
    this.form.innerHTML = `
    <div class="akun-title"><p>MASUK AKUN</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="email">Email:</label></p>
        <input type="email" name="email" id="email" required/>
      </div>
      <div class="field">
        <button class="btn" type="submit" role="button">MASUK</button>
      </div>
    </div>`;
    this.content.append(this.form);
    this.formListener();
  }
  async makeOTP(email) {
    this.type = 'verify';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/login';
    this.form.innerHTML = `
    <div class="akun-title"><p>MASUK AKUN</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="email">Email:</label></p>
        <input type="email" name="email" id="email" value="${email}" required readonly/>
      </div>
      <div class="field">
        <p>
          <label for="code">Kode 6 digit:</label>
          <span id="btn-see-otp"><i class="fa-solid fa-circle-question"></i></span>
        </p>
        <input class="numInput" min="0" max="999999" type="number" name="code" id="code" required/>
      </div>
      <div class="field">
        <button class="btn" type="submit" role="button">KONFIRMASI</button>
      </div>
      <div class="field">
        <p class="center"><a href="/void/login" id="btn-login">Kembali ke Halaman Login</a></p>
      </div>
    </div>`;
    this.content.append(this.form);
    this.formListener();

    this.isLocked = true;
    await modal.alert('Kami telah mengirimkan kode OTP ke alamat email tersebut.\nSilakan masukkan kode OTP tersebut untuk melanjutkan.');
    this.isLocked = false;
    const btnSeeOTP = this.form.querySelector('#btn-see-otp');
    btnSeeOTP.onclick = async() => {
      this.isLocked = true;
      await modal.alert('Kami telah mengirimkan kode OTP ke alamat email tersebut.\nSilakan masukkan kode OTP tersebut untuk melanjutkan.');
      this.isLocked = false;
    }
    const btnLogin = this.form.querySelector('#btn-login');
    btnLogin.onclick = e => {
      e.preventDefault();
      this.closeMethod();
      this.makeLogin();
    }
  }
  formListener() {
    this.form.onsubmit = async e => {
      e.preventDefault();
      if(this.isLocked === true) return;
      this.isLocked = true;

      if(this.type === 'signout') {
        const isConfirm = await modal.confirm({
          msg: `Yakin ingin keluar dari akun saat ini?`,
          okx: 'IYA, KELUAR',
          cancelx: 'GA JADI',
          ic: 'circle-question'
        });
        if(isConfirm !== true) {
          this.isLocked = false;
          return;
        }
      }

      let data = {};
      const formData = new FormData(this.form);
      for(const [key,val] of formData) {
        data[key] = val;
      }
      const workakun = await modal.loading(xhr.post('/auth/' + this.type, data));
      if(!workakun || workakun.code !== 200) {
        await modal.alert(workakun.msg || 'Terjadi Kesalahan');
        this.isLocked = false;
        return;
      }

      if(workakun.data?.step === 1) {
        this.isLocked = false;
        this.closeMethod();
        return this.makeOTP(workakun.data?.email);
      } else if(workakun.data?.step === 2) {
        this.isLocked = false;
        this.closeMethod();
        return this.makeUser(workakun.data.user);
      } else if(workakun.data?.step === 3) {
        this.isLocked = false;
        await this.destroy();
        new Biaya().run();
      }
    }
  }
  closeMethod() {
    if(this.form) this.form.remove();
  }
  async destroy() {
    if(this.element) {
      this.element.classList.add('out');
      await waittime();
      this.element.remove();
    }
    elman.classOpened = null;
  }
  run() {
    elman.classOpened = this;
    nav.setTitle(this.name);
    this.initial();
  }
}