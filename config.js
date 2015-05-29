module.exports = {
  version: '0.1.0',
  database: 'dbname',
  cronjob: '* 2 * * * * *',
  mongodump: '/usr/local/bin/mongodump',
  aws: {
    bucketName: '',
    accessKeyId: '',
    secretAccessKey: ''
  }
};
