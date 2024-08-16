import Akun from "../main/Akun.js";
import db from "./db.js";
import elman from "./elman.js";
import { modal, waittime } from "./modal.js";
import xhr from "./xhr.js";

export default class {
  constructor({type=0,brg={}} = {}) {
    this.type = type;
    this.brg = brg;
    this.isLocked = false;
  }
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('fuwi', '_tambarang');
    this.element.innerHTML = `
    <form action="/add-item" class="form" data-tambarang="brlnk">
      <div class="field center">
        <p><b>${this.type === 0 ? 'TAMBAH' : 'GANTI'} BARANG</b></p>
      </div>
      <div class="field">
        <label for="item_name">Nama Barang:</label>
        <input type="text" name="item_name" id="item_name" autocomplete="off" maxlength="50" ${this.brg.name ? `value="${this.brg.name}"` : ''} required autofocus/>
      </div>
      <p>Tipe Barang:</p>
      <div class="tr-types">
        <div class="tr-type">
          <label for="item_type_1">
            <input type="radio" name="item_type" id="item_type_1" ${this.brg.type===0 ? 'checked': ''} value="0" required/>
            <p>Rokok</p>
          </label>
        </div>
        <div class="tr-type">
          <label for="item_type_2">
            <input type="radio" name="item_type" id="item_type_2" ${this.brg.type===2 ? 'checked': ''} value="2" required/>
            <p>Lainnya</p>
          </label>
        </div>
      </div>
      <div class="field">
        <label for="item_price">Harga Barang:</label>
        <input type="text" name="item_price" id="item_price" autocomplete="off" maxlength="10" ${this.brg.price ? `value="${this.brg.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}"` : ''} required/>
      </div>
      <div class="br-t"></div>
      ${this.type === 1 ? `
      <div class="field">
        <label for="item_desc">Riwayat Update:</label>
        <div class="history" data-history="tambarang"></div>
      </div>
      <div class="field action">
        <div class="btn" role="button" data-delete="tambarang">hapus</div>
      </div>` : ''}
      <div class="field actions">
        <div class="btn" role="button" data-cancel="tambarang">BATAL</div>
        <button class="btn" type="submit">
          ${this.type === 0 ? 'tambah' : 'ganti'}
        </button>
      </div>
    </form>`;
    const echangelog = this.element.querySelector('[data-history]');
    if(echangelog) {
      let changes = db.items[this.brg.id].last || [];
      if(changes.length < 1) {
        echangelog.innerHTML = `<p>Belum ada perubahan</p>`;
      }
      changes.forEach(ch => {
        const p = document.createElement('p');
        p.innerHTML = `${db.users.find(uk => uk.id === ch[0]).name}: Rp${ch[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} - ${new Date(ch[1]).toLocaleString()}`;
        echangelog.prepend(p);
      });
    }
  }
  priceFormatter() {
    const input = this.element.querySelector('#item_price');
    input.oninput = () => {
      input.value = input.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
  submitListener() {
    const btnCancel = this.element.querySelector('[data-cancel]');
    btnCancel.onclick = () => {
      if(this.isLocked === true) return;
      this.isLocked = true;
      this.destroy();
    }
    const btnDelete = this.element.querySelector('[data-delete]');
    if(btnDelete) btnDelete.onclick = async() => {
      if(this.isLocked === true) return;
      this.isLocked = true;

      const isConfirm = await modal.confirm({
        msg: `Yakin ingin menghapus data ${this.brg.name}?`,
        ic: 'circle-question'
      });
      if(isConfirm !== true) {
        this.isLocked = false;
        return;
      }

      let data = {};
      data.worktype = 2;
      if(this.brg.id) data.workid = this.brg.id;
      const delTam = await modal.loading(xhr.post('/uwu/work/item', data));

      if(delTam && delTam.code === 441) {
        await modal.alert(delTam.msg || 'Silakan login terlebih dahulu');
        this.isLocked = false;
        return new Akun().run()
      }
      if(!delTam || delTam.code !== 200) {
        await modal.alert(delTam.msg || 'Terjadi Kesalahan');
        this.isLocked = false;
        return;
      }
      document.querySelector(`#brg_${this.brg.id}`)?.remove();
      await modal.alert(`Berhasil Menghapus ${this.brg.name}!`);
      this.isLocked = false;
      this.destroy();
    }
    const form = this.element.querySelector('[data-tambarang]');
    form.onsubmit = async e => {
      e.preventDefault();
      if(this.isLocked === true) return;
      this.isLocked = true;

      const isConfirm = await modal.confirm({
        msg: 'Pastikan data barangnya udah bener.\nLanjutkan?',
        okx: 'LANJUT',
        cancelx: 'CEK LAGI'
      });
      if(isConfirm !== true) {
        this.isLocked = false;
        return;
      }

      let data = {};
      data.worktype = this.type;
      if(this.brg.id) data.workid = this.brg.id;

      const formData = new FormData(form);
      for(const [key,val] of formData) {
        data[key] = val;
      }

      const postTam = await modal.loading(xhr.post('/uwu/work/item', data));
      if(postTam && postTam.code === 441) {
        await modal.alert(postTam.msg || 'Silakan login terlebih dahulu');
        await this.destroy();
        this.isLocked = false;
        return new Akun().run()
      }
      if(!postTam || postTam.code !== 200) {
        await modal.alert(postTam?.msg || 'Terjadi Kesalahan');
        await this.destroy();
        this.isLocked = false;
        return;
      }

      db.items[this.brg.id] = postTam.data;

      if(['barang', 'rokok'].includes(elman.classOpened?.name)) elman.classOpened?.renderBarang(postTam.data);
      this.destroy();
    }
  }
  async destroy() {
    this.element.classList.add('out');
    await waittime(495);
    this.type = 0;
    this.isLocked = false;
    this.element.remove();
  }
  run() {
    this.createElement();
    document.querySelector('body').append(this.element);
    this.submitListener();
    this.priceFormatter();
  }
}