var fs = require('fs');
var qs = require('qs');
var _ = require('lodash');



var rankListLog = {
    result: {},
    _uvCache: {},
    handle: function(data){
        var record;
        var result = this.result;
        var uvCache = this._uvCache;
        if(result[data.rank_list_name]){
            record = result[data.rank_list_name];
            record.pv++;
            data.isSub ? record.subPv++ : record.notSubPv++;

            if(!uvCache[data.rank_list_name+data.did]){
                uvCache[data.rank_list_name+data.did] = true;
                result[data.rank_list_name].uv++;
                data.isSub ? record.subUv++ : record.notSubUv++;
            }
        }else{
            uvCache[data.rank_list_name+data.did] = true;
            record = result[data.rank_list_name] = {
                pv: 1,
                uv: 1
            };

            if(data.isSub){
                record.subPv = 1;
                record.notSubPv = 0;
                record.subUv = 1;
                record.notSubUv = 0;
            }else{
                record.subPv = 0;
                record.notSubPv = 1;
                record.subUv = 0;
                record.notSubUv = 1;
            }
        }
    },
    getResult: function(){
        return this.result;
    }
};

var rankListItemLog = {
    result: {},
    getResult: function(){
        return this.result;
    }
};


var logStr = _.trim(fs.readFileSync('./data/rank_list_log', {encoding: 'utf-8'}));
logs = logStr.split('\n');
_.forEach(logs, function(str){
    //console.log(str);

    var paramsMatch = str.match(/v.gif\?([\w\W]+?)\s/);
    var params, data, record;


    if(paramsMatch && paramsMatch[1]){
        params = paramsMatch[1];
        data = qs.parse(params);
    }

    rankListLog.handle(data);
});





console.log(rankListLog.getResult());
