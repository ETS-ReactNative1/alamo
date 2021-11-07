const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const AWS = require('aws-sdk')

dotenv.config()

const AWS_ID = process.env.AWS_ID
const AWS_SECRET = process.env.AWS_SECRET

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET
})

const BUCKET_NAME = 'alamo-prod'

const latestLogFile = (dir) => {
  const files = fs.readdirSync(dir)
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .filter((file) => !file.match(/^\./gi))
    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
  return files[0]
};

const uploadLogsToS3 = (() => {
  // Read content from the file
  const logfile = latestLogFile('logs/')
  const dynoLogs = fs.readFileSync(`logs/${logfile.file}`)

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: logfile.file, // File name you want to save as in S3
    Body: dynoLogs
  }

  // Uploading files to the bucket
  s3.upload(params, (err, data) => {
    if (err) {
      throw err
    }
    console.log(`File uploaded successfully. ${data.Location}`)
  })
})()
