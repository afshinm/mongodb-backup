#!/usr/bin/env node
var aws = require('aws-sdk');
var config = require('./config.js');
var program = require('commander');
var spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
var tasks = require('./tasks');
var utils = require('./utils');
var path = require('path');


//DEFINE
var VERSION = '0.1.0';

program
.version(VERSION)
.description('Scheduled backup for MongoDB')
.arguments('<cmd>')
.action(function (cmd, env) {
  cmdValue = cmd;
  envValue = env;
}).parse(process.argv);

if (typeof cmdValue === 'undefined') {
   console.error('No command given! Try --help');
   process.exit(1);
}

if (cmdValue == 'start') {
  //new CronJob(config.cronjob, cronjob, null, true);
  cronjob()
};

function cronjob () {
  //mongodump
  tasks.mongodump().then(function () {
    tasks.zip(config.database, path.join(__dirname, 'dump')).then(function (filepath) {
      tasks.s3(filepath).then(function () {
        tasks.clean(filepath).then(tasks.clean(path.join(__dirname, 'dump', config.database))).then(function () {
          utils.log('debug', 'Done.');
        }).catch(function (ex) {
          utils.log('error', ex);
        });
      }).catch(function (ex) {
        utils.log('error', ex);
      });
    });
  });
};
