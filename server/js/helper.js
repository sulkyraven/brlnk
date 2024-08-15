module.exports = {
  fixedNumber(n = 6) {
    let a = "";
    for(let i = 1; i < n; i++) { a += "0"; }
    return Math.floor(Math.random() * Number("9" + a)) + Number("1" + a);
  }
}