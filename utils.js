/**
 * Utils
 *
 */
exports.log = function (type, msg) {
  switch (type) {
    case 'debug':
      console.info(msg);
      break;
    case 'error':
      console.error(msg);
      break;
  }
};
