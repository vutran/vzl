# Contributing

You need Node and npm installed on your machine to contribute.

1.  Clone the repository

```
$ git clone git@github.com:vutran/vzl.git
```

2.  Install necessary npm dependencies

```
$ cd vzl

$ npm install
```

3.  Start the Electron development app

```
$ npm start
```

## Generating Binaries

Please ensure that your code works before generating an application binary. Once confirmed, you can generate your binaries like so:

```
$ npm run pack
```

All packed binaries will live in the `./dist` folder.
