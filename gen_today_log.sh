#!/bin/sh
PWD=/root/www/node-log
SERVER=bae@121.40.122.152

ssh $SERVER /home/bae/tongji/filter_rank.sh $1
scp bae@121.40.122.152:/home/bae/tongji/_today_log.tmp $PWD/data/_today_log.tmp
cd $PWD && node parser.js $1

