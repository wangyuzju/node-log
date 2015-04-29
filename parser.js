var fs = require('fs');
var qs = require('qs');
var _ = require('lodash');




var logStr = _.trim(fs.readFileSync('./data/_today_log.tmp', {encoding: 'utf-8'}));
logs = logStr.split('\n');


var result = {};

_.forEach(logs, function(str){
    //console.log(str);

    var paramsMatch = str.match(/v.gif\?([\w\W]+?)\s/);
    var params, data, record;


    if(paramsMatch && paramsMatch[1]){
        params = paramsMatch[1];
        data = qs.parse(params);

        if(result[data['t']]){
            // push
            result[data['t']].push(data);
        }else{
            result[data['t']] = [data];
        }
        delete data['t'];
        //process.exit();
    }

    //rankListLog.handle(data);
});

var output = '';
_.forEach(result, function(v, k){
    output += '\n' + k + ' (' + _.keys(v[0]).join('|') + ') ' + '\n---\n';


    // content
    _.forEach(v, function(_v){
        //console.log(_v)
        output += _.values(_v).join('\t') + '\n';
    });
});

console.log(output);
//console.log(rankListLog.getResult());
