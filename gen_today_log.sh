#!/bin/sh
SERVER=bae@121.40.122.152
ssh $SERVER /home/bae/tongji/filter_rank.sh
scp bae@121.40.122.152:/home/bae/tongji/_today_log.tmp data/
node parser.js

