var utils = require('./utils');
var spawn = require('child_process').spawn;
var config = require('./config');
var archiver = require('archiver');
var Q = require('q');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var rmdir = require('rimraf');


/**
 * Create a backup from database
 */
exports.mongodump = function () {
  utils.log('debug', 'start mongodump task...');

  var deferred = Q.defer();
  var args = ['--db', config.database];
  var mongodump = spawn(config.mongodump, args);

  mongodump.stdout.on('data', function (data) {
    utils.log('debug', data.toString());
  });
  mongodump.stderr.on('data', function (data) {
    utils.log('debug', data.toString());
  });
  mongodump.on('exit', function (code) {
    utils.log('debug', 'mongodump exited with code: ' + code);
    deferred.resolve(code);
  });

  return deferred.promise;
};

/**
 * Archive a folder
 */
exports.zip = function (filename, folder) {
  utils.log('debug', 'start zip task...');
  var deferred = Q.defer();

  var archive = archiver('tar', {
    gzip: true,
    gzipOptions: {
      level: 1
    }
  });
  var outputFilename = path.join(folder, filename + '.tar');
  var output = fs.createWriteStream(outputFilename);

  output.on('close', function() {
    deferred.resolve(outputFilename);
  });

  archive.on('error', function (err) {
    deferred.reject(err);
  });

  archive.directory(path.join(folder, filename));

  archive.pipe(output)
  archive.finalize();

  return deferred.promise;
};

/**
 * Upload a file to Amazon S3
 */
exports.s3 = function (filepath) {
  utils.log('debug', 'start S3 task...');

  var deferred = Q.defer();
  //credentials settings
  AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  });
  var s3 = new AWS.S3();

  fs.readFile(filepath, function (err, data) {
    if (err) throw err;

    var params = {
      Bucket: config.aws.bucketName,
      Key: new Date().getTime() + '.tar',
      ContentType: 'application/x-gzip',
      Body: data
    };

    s3.putObject(params, function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve({});
      }
    });
  });

  return deferred.promise;
};

/**
 * Delete file and folders
 */
exports.clean = function (filename) {
  utils.log('debug', 'start cleanup task...');

  var deferred = Q.defer();

  fs.stat(filename, function (err, stats) {
    if (stats.isDirectory()) {
      rmdir(filename, function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve({});
        }
      });
    } else {
      //a file
      fs.unlink(filename, function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve({});
        }
      });
    }
  });

  return deferred.promise;
};
