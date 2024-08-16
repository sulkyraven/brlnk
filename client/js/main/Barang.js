import db from "../helper/db.js";
import elman from "../helper/elman.js";
import { waittime } from "../helper/modal.js";
import tambarang from "../helper/tambarang.js";
import nav from "./nav.js";

export default class Barang {
  constructor({
    tyfilter = [0,1],
    name = 'barang'
  } = {}) {
    this.name = name;
    this.tyfilter = tyfilter;
    this.searchopened = false;
  }
  createElement() {
    this.element = document.createElement('section');
    this.element.classList.add('sect', '_barang');
    this.element.innerHTML = `
    <div class="content content-1">
      <div class="item btn-add-item" role="button">
        <i class="fa-solid fa-plus"></i> Tambah Barang
      </div>
    </div>
    <div class="content content-2"></div>`;
    this.elist = this.element.querySelector('.content-2');
    this.btnAdd = this.element.querySelector('.btn-add-item');
  }
  getBarangList() {
    const rdb = Object.keys(db.items).filter(key => this.tyfilter.includes(db.items[key].type)).sort((a, b) => {
      if(db.items[a].name < db.items[b].name) return 1;
      if(db.items[a].name > db.items[b].name) return -1;
      return 0;
    }).map(key => {
      return { ...db.items[key], id:key}
    });
    rdb.forEach(brg => this.renderBarang(brg));
  }
  renderBarang(brg) {
    let item = document.querySelector(`#brg_${brg.id}`);
    if(!item) {
      item = document.createElement('div');
      item.classList.add('item');
      item.id = `brg_${brg.id}`;
      this.elist.prepend(item);
    }
    item.innerHTML = `
    <div class="col col-1">
      <div class="row row-1">
        <div class="item-name">
          <p>${brg.name}</p>
        </div>
        <div class="item-price">
          <p>Rp${brg.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        </div>
      </div>
      <div class="row row-2">
        <p>${brg.last ? (db.users.find(uk => uk.id === brg.last[brg.last.length - 1][0]).name || '-') + ' - ' + new Date(brg.last[brg.last.length - 1][1]).toLocaleString() : ''}</p>
      </div>
    </div>
    <div class="col col-2">
      <a href="#edit" class="btn-edit">
        <i class="fa-solid fa-pen-to-square"></i>
      </a>
    </div>`;
    const btnEdit = item.querySelector('.btn-edit');
    btnEdit.onclick = (e) => {
      e.preventDefault();
      if(this.searchopened) {
        this.esearch.remove();
        this.searchopened = false;
      }
      nav.destroy();
      new tambarang({type:1,brg:brg}).run();
    }
  }
  btnAddListener() {
    this.btnAdd.onclick = () => {
      if(this.searchopened) {
        this.esearch.remove();
        this.searchopened = false;
      }
      nav.destroy();
      new tambarang().run();
    }
  }
  getSearch() {
    if(this.searchopened === true) return;
    this.searchopened = true;
    
    this.esearch = document.createElement('div');
    this.esearch.classList.add('quicksearch');
    this.esearch.innerHTML = `
    <div class="field">
      <input type="text" name="quicksearch" id="quicksearch" autocomplete="off" placeholder="Ketik Nama Barang" autofocus />
      <div class="btn btn-quicksearch" role="button">
        <i class="fa-solid fa-circle-x"></i>
      </div>
    </div>`;
    document.querySelector('.main ._barang')?.prepend(this.esearch);
    const input = this.esearch.querySelector('#quicksearch');
    input.focus();

    input.oninput = () => {
      nav.destroy();
      this.elist.innerHTML = '';
      nav.setTitle('PENCARIAN');
      if(elman?.classOpened?.name) elman.classOpened.name = 'barang';
      Object.keys(db.items).filter(key => {
        return db.items[key].name.toLowerCase().includes(input.value.toLowerCase());
      }).forEach(key => {
        let brg = {...db.items[key], id:key};
        this.renderBarang(brg);
      });
    }

    const esClose = this.esearch.querySelector('.btn-quicksearch');
    esClose.onclick = () => {
      this.esearch.remove();
      this.searchopened = false;
    }
  }
  async destroy() {
    if(this.searchopened) {
      this.esearch.remove();
      this.searchopened = false;
    }
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
    this.getBarangList();
    this.btnAddListener();
    nav.setTitle(this.name);
  }
}