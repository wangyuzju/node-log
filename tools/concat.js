/**
 * concat defined log files
 */
var fs = require('fs');

var _ = require('lodash');
var glob = require('glob');



_.forEach(['2015-04-27', '2015-04-28'], function(date){
    glob(date + "/buying_method**.txt", {cwd: '../log'}, function(er, files){
        var result;
        _.forEach(files, function(m){
            // console.log(m);
            result += fs.readFileSync('../log/' +  m, {encoding: 'utf8'});
        });
        console.log(result);
    });
});



