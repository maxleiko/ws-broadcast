var CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

module.exports = function () {
  var res = '';
  for (var i = 0; i < 10; i++) {
    res += CHARS[Math.floor(Math.random() * (CHARS.length - 0))];
  }
  return res;
};
