export default {
  request(ref, method, data = null) {
    return new Promise(async resolve => {
      let fetchData = { method };
      if(method == "POST") {
        fetchData.headers = {"Content-Type": "application/json"};
        fetchData.body = JSON.stringify(data || {});
      }

      resolve(await fetch(ref, fetchData).then(res => {
        if(!res.ok) return {status: 500, msg: res.statusText || "Terjadi Kesalahan"}

        return res.json();
      }).then(res => {
        return res;
      }).catch(err => {
        return {status: 500, msg: "Terjadi kesalahan - E-500", data: err};
      }));
    });
  },
  async post(ref, data) {
    return await this.request(ref, 'POST', data)
  },
  async get(ref) {
    return await this.request(ref, 'GET');
  }
}