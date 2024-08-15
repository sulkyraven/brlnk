import elman from "../helper/elman.js";
import { modal, waittime } from "../helper/modal.js";
import xhr from "../helper/xhr.js";
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
    this.element.innerHTML = `<div class="content">Memuat</div>`;
    this.content = this.element.querySelector('.content');

    const isUser = await xhr.get('/uwu/isUser');
    this.content.innerHTML = '';
    if(!isUser || isUser.code !== 200) return this.makeLogin();
    return this.makeUser();
  }
  makeUser() {
    this.checkUser();
    this.type = 'signout';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/signout';
    this.form.innerHTML = `
    <div class="akun-title"><p>AKUN</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="username">Username:</label></p>
        <input type="text" name="username" id="username" value="dvnkz"/>
      </div>
      <div class="field">
        <label for="email">Email:</label>
        <input type="text" name="email" id="email"/>
      </div>
      <div class="field">
        <button class="btn logout" type="submit">KELUAR AKUN</button>
      </div>
    </div>`;
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
        <p><label for="user">Username/Email:</label></p>
        <input type="text" name="user" id="user"/>
      </div>
      <div class="field">
        <p>
          <label for="password">Password:</label>
          <span><i class="fa-solid fa-eye"></i></span>
        </p>
        <input type="text" name="password" id="password"/>
        <p class="btn-action"><a href="/void/forgot" id="btn-forgot">Lupa Password?</a></p>
      </div>
      <div class="field">
        <button class="btn" type="submit" role="button">MASUK</button>
      </div>
      <div class="field">
        <p class="center">Belum Punya Akun? <a href="/void/register" id="btn-register">Daftar Sekarang</a></p>
      </div>
    </div>`;
    this.content.append(this.form);
    const btnRegister = this.form.querySelector('#btn-register');
    btnRegister.onclick = e => {
      e.preventDefault();
      this.closeMethod();
      this.makeRegister();
    }
    const btnForgot = this.form.querySelector('#btn-forgot');
    btnForgot.onclick = e => {
      e.preventDefault();
      this.closeMethod();
      this.makeForgot();
    }
  }
  makeRegister() {
    this.type = 'register';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/register';
    this.form.innerHTML = `
    <div class="akun-title"><p>DAFTAR AKUN</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="username">Username:</label></p>
        <input type="text" name="username" id="username"/>
      </div>
      <div class="field">
        <p><label for="email">Email:</label></p>
        <input type="text" name="email" id="email"/>
      </div>
      <div class="field">
        <p>
          <label for="code">Kode 6 digit:</label>
          <span><i class="fa-solid fa-circle-question"></i></span>
        </p>
        <input type="text" name="code" id="code"/>
      </div>
      <div class="field">
        <p>
          <label for="password">Password:</label>
          <span><i class="fa-solid fa-eye"></i></span>
        </p>
        <input type="text" name="password" id="password"/>
      </div>
      <div class="field">
        <button class="btn" type="submit" role="button">DAFTAR</button>
      </div>
      <div class="field">
        <p class="center">Sudah punya akun? <a href="/void/login" id="btn-login">Masuk Sekarang</a></p>
      </div>
    </div>`;
    this.content.append(this.form);
    const btnLogin = this.form.querySelector('#btn-login');
    btnLogin.onclick = e => {
      e.preventDefault();
      this.closeMethod();
      this.makeLogin();
    }
  }
  makeForgot() {
    this.type = 'forgot';

    this.form = document.createElement('form');
    this.form.classList.add('form');
    this.form.action = '/auth/forgot';
    this.form.innerHTML = `
    <div class="akun-title"><p>LUPA PASSWORD</p></div>
    <div class="akun-content">
      <div class="field">
        <p><label for="email">Email:</label></p>
        <input type="text" name="email" id="email"/>
      </div>
      <div class="field">
        <p>
          <label for="code">Kode 6 digit:</label>
          <span><i class="fa-solid fa-circle-question"></i></span>
        </p>
        <input type="text" name="code" id="code"/>
      </div>
      <div class="field">
        <button class="btn" type="submit" role="button">PULIHKAN</button>
      </div>
      <div class="field">
        <p class="center"><a href="/void/login" id="btn-login">Kembali ke halaman login</a></p>
      </div>
    </div>`;
    this.content.append(this.form);
    const btnLogin = this.form.querySelector('#btn-login');
    btnLogin.onclick = e => {
      e.preventDefault();
      this.closeMethod();
      this.makeLogin();
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