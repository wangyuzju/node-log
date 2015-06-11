var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/**
 *
 * @link https://github.com/andris9/nodemailer-smtp-transport#usage
 */
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.ym.163.com',
    port: 994,
    secure: true,
    auth: {
        user: 'wangyu@licaimofang.com',
        pass: 'wangyusi'
    }
}));


function sendTestMail(receiver){
    receiver = receiver || 'wangyu@licaimofang.com';
    // send mail
    transporter.sendMail({
        from: 'wangyu@licaimofang.com',
        to: receiver,
        subject: 'hello world!',
        text: 'Authenticated with OAuth2'
    }, function(err, info){
        console.log(err);

        console.log(info);
    });
}

/**
 * 发送邮件
 */
module.exports.sendMail = function(opt){
    transporter.sendMail(opt);
};

/**
 *
 */
module.exports.sendTestMail = sendTestMail;
