# nightlifeapp

### Build
```sh
$ npm run build_prod
```
for development
```sh
$ npm run build_dev
```

### Start
(requires forever to be installed)
```sh
$ npm run start_prod
```
for development
```sh
$ npm run start_dev
```

Don't forget to create a file named config.json in root directory

config.json structure
``` json
{
    "access_token":"YELP_ACCESS_TOKEN",
    "TWITTER_CONSUMER_KEY":"CONSUMER_KEY",
    "TWITTER_CONSUMER_SECRET":"CONSUMER_SECRET",
    "TWITTER_CALLBACK_URL":"CALLBACK_URL",
    "SESSION_SECRET":"SESSION_VERY_SECRET_KEY",
    "MONGO_DB":"URL_TO_MONGO_DB"
}
```
