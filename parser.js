var fs = require('fs');
var qs = require('qs');
var _ = require('lodash');
var utils = require('./lib/utils');



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


var dateStamp = utils.formatDate(new Date(new Date() - 24*3600*1000), 'yyyy-MM-dd');

var outputDir = './log/' + dateStamp + '/';


if(!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}



_.forEach(result, function(v, k){
    //output += '\n' + k + ' (' + _.keys(v[0]).join('|') + ') ' + '\n---\n';
    var output = '';

    // content
    _.forEach(v, function(_v){
        //console.log(_v)
        output += _.values(_v).join('\t') + '\n';
    });

    fs.writeFileSync(outputDir + k + '.txt', output);
});

//console.log(output);

//fs.writeFileSync('./log/' + dateStamp + '.txt', output);
//console.log(rankListLog.getResult());
