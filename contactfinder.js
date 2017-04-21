const request = require('superagent');
let URL = process.argv[];

function checkContact(val) {
  request
    .get(val)
    .end(function(err, res) {
    });
};
checkContact(URL);
