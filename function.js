const  _ =  require('lodash');

const say = _.rest(function(what, names) {
    return what + ' ' + _.initial(names).join(', ') +
      (_.size(names) > 1 ? ', & ' : '') + _.last(names);
  });
   
const res = say('Serverless','Docker', 'Openwhisk', 'K8s', 'nodejs','cold_start');
console.log(res);