# MongoDB Backup
Scheduled backup solution for MongoDB

# How it works?
Well, it's really straighforward. There is a cronjob inside the app that executes `mongodump` command and it creates a tar file of your database (that already defined in `config.json`). 

Then, it moves the backup file to an specific storage. Currenlty we support **Amazon S3** but more options will be added soon.

# Credits
Afshin Mehrabani

# License
MIT
