var fs = require('fs');
var xlsx = require('node-xlsx');
var utils = require(__dirname + '/../lib/utils');
var email = require('../lib/email');


var dateStamp = utils.formatDate(
    // date object
    process.argv[2] ? new Date(process.argv[2]) : new Date(new Date() - 24*3600*1000),
    // format str
    'yyyy-MM-dd');
//var obj = xlsx.parse(__dirname + '/../data/log.xlsx'); // parses a file

//console.log(obj[0]);

email.sendMail({
    from: 'wangyu@licaimofang.com',
    to: 'wangyu@licaimofang.com',
    subject: '统计报表_' + dateStamp,
    text: '请查看附件\n\n\n',
    attachments: [{
        filename: '',
        path: __dirname + '/../log/' + dateStamp + '/daily_log.xlsx'
    }]
});
