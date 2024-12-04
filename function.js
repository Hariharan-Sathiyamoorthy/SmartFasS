const  _ =  require('lodash');
/**
 * @param {string} a
 * @param {string[]} b
 * @returns {string}
 */

const say = _.rest(function(a, b) {
    return a + ' ' + _.initial(b).join(', ') +
      (_.size(b) > 1 ? ', & ' : '') + _.last(b);
  });
   
const res = say('Serverless','Docker', 'Openwhisk', 'K8s', 'nodejs','cold_start');
console.log(res);