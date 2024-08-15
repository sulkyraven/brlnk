import elman from "../helper/elman.js";
import { waittime } from "../helper/modal.js";
import nav from "./nav.js";

export default class Barang {
  constructor() {
    this.name = 'catatan';
  }
  createElement() {
    this.element = document.createElement('section');
    this.element.classList.add('sect', '_barang');
    this.element.innerHTML = `
    <div class="content">
      <p>Sik durung mari fitur sing iki, hehe...</p>
    </div>`;
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
    this.createElement();
    document.querySelector('main').appendChild(this.element);
    nav.setTitle(this.name);
  }
}