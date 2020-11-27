var chalk = require('chalk');

module.exports = function(){
  'use strict';
  var sig = '['+chalk.green('vtexgen')+']';
  var args = Array.prototype.slice.call(arguments);
  args.unshift(sig);
  console.log.apply(console, args);
  return this;
};
