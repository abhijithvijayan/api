# ktu-result-notifier

Telegram bot notifier to show result stats on KTU Result Publish

## How to start
### Install node modules
`npm install`
### Create .env file in root location of project
`touch .env`
```
PORT=3000
NODE_ENV=development
REDIS_PORT=6379
REDIS_HOST=host.docker.internal
IMAGE_PATH=
IMAGE_URL=
API_KEY=
FIREBASE_DB_URL=
SLACK_TOKEN=
SLACK_CHANNEL=
```
### Start project
`npm start`

### Running in developement with nodemon
`npm run dev`

### Running test
`npm run test`
