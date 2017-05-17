const request = require('superagent');
var Promise = this.Promise || require('promise');
const URL = require('url');
var agent = require('superagent-promise')(request, Promise);
const cheerio = require('cheerio');
var whois = require('whois-ux');

module.exports = checkContact;

function checkContact(url) {
  return Promise.all([
    getDNSEmail(url2domain(url)),
    getHTMLContacts(url)
  ]).then(function (data) {
    return JSON.stringify(mergeObjs(data));
  })
  .catch(function (err) {
    return {};
  });
}

function getHTMLContacts(htmlUrl) {
  return new Promise(function (accept, reject) {
    agent
      .get(htmlUrl)
      .end()
      .then(function(res) {
        const $ = cheerio.load(res.text);
        accept({
          'contactUrl': getContact($),
          'emailFromHtml': getEmail(res.text)
        });
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function getEmail(html) {
  let email = /[\w-]+@([\w-]+\.)+[\w-]+/.exec(html);
  if (email !== null && email !== 0) {
    return email[0];
  } else {
    return null;
  }
}

function getContact($) {
  if ($("a[href*='contact']").length !== 0) {
    return $("a[href*='contact']")[0].attribs.href;
  } else {
    return null;
  }
}

function getDNSEmail(domain) {
  return new Promise(function (accept, reject) {
    whois.whois(domain, function (err, data){
      accept({ 'emailFromDns': data['Registrant Email'] });
    });
  });
}

function url2domain(fullUrl) {
  return fullUrl.includes('://') ? (new URL.URL(fullUrl)).hostname : fullUrl;
}

function mergeObjs(objs) {
  return objs.reduce(function(result, currentObject) {
      for(var key in currentObject) {
          if (currentObject.hasOwnProperty(key)) {
              result[key] = currentObject[key];
          }
      }
      return result;
  }, {});
}