import db from "../helper/db.js";
import elman from "../helper/elman.js";
import { waittime } from "../helper/modal.js";
import Barang from "./Barang.js";
import sect from "./sect.js";

class Nav {
  constructor() {
    this.opened = false;
    this.locked = false;
  }
  setTitle(newtitle) {
    const title = document.querySelector('.nav .text .title');
    title.innerHTML = newtitle;
  }
  menuBarListener() {
    const btnNav = document.querySelector('.nav .btn-menu');
    btnNav.onclick = () => {
      if(this.locked === true) return;
      this.locked = true;
      if(this.opened === true) return this.destroy();
      return this.createNav();
    }
  }
  async createNav() {
    this.element = document.createElement('div');
    this.element.classList.add('nav-fly');

    sect.forEach(item => {
      const menu = document.createElement('div');
      menu.classList.add('btn');
      menu.role = 'button';
      menu.innerHTML = item.name;
      this.element.append(menu);
      menu.onclick = async() => {
        if(this.locked === true) return;
        this.locked = true;
        this.destroy();
        if(item.name === elman.classOpened?.name) return;
        if(elman.classOpened) await elman.classOpened.destroy?.();
        item.run();
      }
    });

    document.querySelector('body').appendChild(this.element);
    await waittime();
    this.opened = true;
    this.locked = false;
  }
  searchListener() {
    const btnSearch = document.querySelector('.btn-search');
    btnSearch.onclick = async() => {
      if(this.locked === true) return;
      this.locked = true;

      if(!elman?.classOpened?.getSearch) {
        await elman?.classOpened?.destroy();
        new Barang().run();
      }

      elman?.classOpened?.getSearch?.();
      this.destroy();
      this.locked = false;
    }
  }
  async destroy() {
    if(this.element) {
      this.element.classList.add('out');
      await waittime();
      this.element.remove();
    }
    this.opened = false;
    this.locked = false;
  }
  runListener() {
    this.menuBarListener();
    this.searchListener();
  }
}

export default new Nav();