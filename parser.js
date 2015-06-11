var fs = require('fs');
var qs = require('qs');
var xlsx = require('node-xlsx');
var _ = require('lodash');
var utils = require('./lib/utils');


var logStr = _.trim(fs.readFileSync('./data/_today_log.tmp', {encoding: 'utf-8'}));
logs = logStr.split('\n');


var result = {};

/**
 * 抽取 NGINX 日志记录成 JSON 格式，便于后面处理
 */
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

/**
 * 抽离时间戳
 */
var dateStamp = utils.formatDate(
	// date object
	process.argv[2] ? new Date(process.argv[2]) : new Date(new Date() - 24*3600*1000),
	// format str
	'yyyy-MM-dd');

/**
 * 生成日志文件存放目录
 * @type {string}
 */
var outputDir = './log/' + dateStamp + '/';
if(!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}


/**
 * 把每一个 t 下的记录单独存放到文件中去
 */
_.forEach(result, function(v, k){
    //output += '\n' + k + ' (' + _.keys(v[0]).join('|') + ') ' + '\n---\n';
    var output = '';

    // content
    _.forEach(v, function(_v){
        //console.log(_v)
        output += _.values(_v).join('\t') + '\n';
    });

    //// 记录 PV 数据
    //var record = viewer[k] = {};
    //record['pv'] = v.length;
    //
    //// 记录 UV 数据
    //record['uv'] = _.uniq(_.pluck(v, 'did')).length;

    fs.writeFileSync(outputDir + k + '.txt', output);
});


/**
 * 抽离报表数据
 */
function extractReportorData(data){
    var sheets = [
        {name: '基金', data: [

        ]},
        {name: 'P2P', data: [

        ]},
        {name: '羊毛', data: [

        ]}
    ];


    function typeFromUrl(url){
        //var urls = url.split('/');
        //var id = urls[urls.length - 1];
        var idMatches = url.match(/(\d+)/);

        if(idMatches){
            var id = idMatches[1];

            if(id[0] == 3){
                return 'fund';
            }else if(id[0] == 9){
                return 'p2p';
            }else{
                return 'unknown';
            }
        }else{
            return 'unknown';
        }
    }

    /**
     * 根据 PAGE 参数中的 tab 和 id 来拆分来源及类型
     * @param data
     * @returns {{}}
     */
    function splitMultiLog(data){
        var result = {};

        _.forEach(data, function (_v) {
            if (!_v.page) {
                return;
            }
            var urls = _v.page.split('/');

            var tab = urls[2];
            var type = typeFromUrl(_v.page);

            if(!result[type]){
                result[type] = {};
            }

            if(!result[type][tab]){
                result[type][tab] = [];
            }
            result[type][tab].push(_v);
        });

        return result;
    }

    function buyingMethodParser(key, data){
        var offset = 4;
        var result = {
            fund: [],
            p2p: []
        };

        _.forEach(data, function(_v, k){
            if (!_v.page) {
                return;
            }
            var urls = _v.page.split('/');
            var type = typeFromUrl(_v.page);

            if(!result[type]){
                result[type] = [];
            }

            result[type].push(_v);
        });

        //console.log(result);

        sheets[0].data.push([key, result.fund.length, _.uniq(_.pluck(result.fund, 'did')).length])
        sheets[1].data.push([key, result.p2p.length, _.uniq(_.pluck(result.p2p, 'did')).length])
    }


    /**
     * 写入一条记录
     */
    function recordParser(sheet, key, data){
        sheet.data.push([key, data.length, _.uniq(_.pluck(data, 'did')).length]);
    }


    /**
     * 将 result 数据写入 sheets
     */
    function data2Xlsx(key, data){
        var typeIndex = {
            fund: 0,
            p2p: 1
        };
        var conf = {
            'rank': '排行榜',
            'profit': '追踪收益',
            'star': '关注',
            'search': '旧版搜索',
            'worth_buying': '值得买搜索'
        };

        function setItem(type){
            var target = sheets[typeIndex[type]];
            _.forEach(['rank', 'profit', 'star', 'search'], function(k){
                var pv = ( data[type] && data[type][k] && data[type][k].length )  || 0;
                var uv = pv > 0 ? _.uniq(_.pluck(data[type][k], 'did')).length : 0;
                target.data.push([key+ '('+ conf[k] +')', pv, uv])
            });
        }

        setItem('fund');
        setItem('p2p');
    }



    data2Xlsx('详情页', splitMultiLog(data['详情页面']));

    buyingMethodParser('购买方式(排行榜)', data['buying_method_rank']);
    buyingMethodParser('购买方式(收益追踪)', data['buying_method_profit']);
    buyingMethodParser('购买方式(关注)', data['buying_method_star']);

    data2Xlsx('去官网购买', splitMultiLog(data['open_buy_link']));

    recordParser(sheets[2], '参与活动', data['worth_buying_open_link']);

    var buffer =  xlsx.build(sheets);
    fs.writeFileSync(outputDir + 'daily_log.xlsx', buffer);
}

extractReportorData(result);
