var fs = require('fs');
/**
 * 读取 log 目录下的文件，返回 pv 数量和 uv 数量
 */
module.exports.parse = parse;



function parse(filePath){
    var content = fs.readFileSync(filePath, {encoding: 'utf-8'});

    console.log(content);
}

parse(__dirname + '/../log/2015-06-08/worth_buying_open_link.txt');
