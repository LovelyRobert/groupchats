# Full Stack Group Chats APP

## Table of contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Backend Setup](#back-end-setup)
- [Frontend Setup](#front-end-setup)
- [Contributing](#contributing)
- [License](#license)

## Overview

A basic and simple web application for group chats I created to improve my skills on Node.js and mongoDB. The application allows multiple signed in users to exchange text, audio, and image messages in real-time within public chat rooms created, moderated, and customized by other signed in users.

The application is built using Vue.js, Tailwind CSS on the frontend, and Node.js and Express on the backend. It uses a MongoDB database to store users, rooms and history data. Mongoose is used as an object document mapper (ODM), and multer is used for file uploading.

Socket.IO is used to handle socket events, and the API is secured using JWT cookies. The application also supports Google authentification using passport.js and mailing using nodemailer.

I am still working on improving the app and adding new features. I am also planning to migrate the app form VUE CLI to Vite, as well as create and share the same app using React for frontend.

## Technologies

- VUE CLI: 5.0.0
- Tailwind CSS: 3.1.8
- Socket.IO: 4.5.2
- Node.js: 17.5.0
- Express: 4.18.2
- Mongoose: 6.6.0
- Passeport: 0.6.0
- JWT: 8.5.1
- Multer: 1.4.5-lts.1
- Nodemailer: 6.9.1

## Main Features

- Group chats
- Rooms' basic customization
- Chat history
- Ban/Allow moderation feature
- Real-time text messaging
- Image and voice record sharing
- Emojis
- Users tagging
- Notifications
- Users' profile
- Google Oauth 2.0
- Mail sending

## Backend Setup

#### To run this project's backend locally:

1. Install the backend locally using npm

```
$ cd /api
$ npm install
```

2. Change `.env.example` to `.env` and add the following variables:

- `CLIENT_URL` - the URI for your backend, ex: **"http://localhost:3000"**
- `APP_URL` - the URI for your frontend, ex: **"http://localhost:8080"**
- `DATABASE_URL` - the URI for your MongoDB database
- `JWT_SECRET` - your jwt secret key

3. To use the Google auth feature, add the folling variables to your `.env`:

- `GOOGLE_CLIENT_ID` - your Google client ID
- `GOOGLE_CLIENT_SECRET` - your Google client secret

4. To use the Mailing feature, add the follwing Nodemailer variables to your `.env`:

- `MAILER_HOST` - nodemailer host parameter ex: **"smtp.mail.yahoo.com"**
- `MAILER_PORT` - nodemailer port parameter ex: **587**
- `MAILER_USER` - nodemailer user email parameter **ex: "example@yahoo.com"**
- `MAILER_PASSWORD` - nodemailer user mail **password**

5. Run it using **npm** or **nodemon**(installed globally):

```
$ npm start server
```

OR

```
$ nodemon server
```

## Frontend Setup

#### To run this project's frontend locally:

1. Install the frontend locally using npm:

```
$ cd /app
$ npm install
```

2. Change `.env.example` to `.env` and add the following variables:

- `BASE_URL` - the URI for your frontend, ex: **"http://localhost:8080"**
- `VUE_APP_API_ENDPOINT` - the URI for your backend, ex: **"http://localhost:3000"**

3. Run it using npm:

```
$ npm run serve
```

## Contributing

Reviews and contributions are welcome! If you have a feature request or a bug to report, please create an issue in the Github repository. If you would like to contribute code, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.
