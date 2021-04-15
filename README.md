# Simple List

## How to run

### Method 1: Using Docker

Run the following command to build and run the app:
```
$ docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

### Method 2: Running in development mode

For this method you will need Node.js and NPM installed.

#### Run cors-anywhere

Before running the app you have to do the following. Change directory to `cors-anywhere` and run the following commands:
```
$ npm install
```
and
```
$ node server.js
```

This will allow cors-anywhere to run a proxy server which we will use to forward the api we need to fetch the data from to return us the missing headers in the response.

#### Run the app

Run the following commands in the app directory:

```
$ npm install
```
and
```
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
