# MongoDB Backup
Scheduled backup solution for MongoDB

# How it works?
Well, it's really straighforward. There is a cronjob inside the app that executes `mongodump` command and it creates a tar file of your database (that already defined in `config.json`). 

Then, it moves the backup file to an specific storage. Currenlty we support **Amazon S3** but more options will be added soon.

# Install

I'm working to create a binary output of project but currently you need latest version of **Nodejs** and a bunch of modules to run this project. So, first of all please install http://nodejs.org/

Then clone the `git` repo and install dependecies:

```
git clone https://github.com/afshinm/mongodb-backup
cd mongodb-backup
npm install
```

Then configure your database using `config.js` file and run following command to start the schedule:

```
./index.js start
```

# Config.js

Here you can find the `config.js` options:

1. `database`:  
   The database name that you want to get backup from  

2. `cronjob`:  
   Cronjob schedule to run the backup job (standard cronjob format)  
   **Default:** `* 2 * * * * *`

3. `mongodump`:  
   Path to `mongodump` binary.  
   **Default:** `/usr/local/bin/mongodump`

4. `aws.bucketName`:  
   S3 bucket name that you want to transfer backup files to.

5. `aws.accessKeyId`:  
   Your AWS access key

6. `aws.secretAccessKey`:  
   Your AWS secret key


# Credits
Afshin Mehrabani

# License
MIT
