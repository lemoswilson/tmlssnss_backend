# tmlssnss
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/lemoswilson/tmlssnss/blob/master/LICENSE.md) 

## About
tmlssnss is an e-commerce platform made with React and CommerceJS API, with added user authentication and history of purchases.

## Layout


<p float="left">
<img src="https://i.imgur.com/GtsGuQY.png" width="47%" height="47%">
<img src="https://i.imgur.com/XtdcCUo.png" width="47%" height="47%">
</p>



<p float="left">
<img src="https://i.imgur.com/KiiEngU.png" width="47%" height="47%">
<img src="https://i.imgur.com/M35rhl8.png" width="47%" height="47%">
</p>



## Tech Stack
### Backend
- NodeJS
- ExpressJS
- MongoDB 
- Typescript
- PassportJS


### Frontend
- HTML / SCSS / TypesScript
- React
- CommerceJS

### Integrations
- Stripe
- CommerceJS
- Algolia for searching

## Production
- Backend: Heroku
- Frontend: Netlify
- Database: MongoDB Atlas

## How to run the app
### Backend
```
# clone repo
git clone https://github.com/lemoswilson/tmlssnss_backend

# change to backend directory
cd backend

# install dependencies
npm install

# set environment variables
# create .env file and set your credentials for ATLAS_URI, Google OAuth, as well as a JWT Authorization, and a URL for the frontend.
MONGO_URI=<Your MongoDB URI>
JWT_AUTHORIZATION=<Your JWT Authorization key>
REACT_APP_URL=<The URL for the frontend> 
EMAIL_SERVICE=<Email service provider>
EMAIL_USER=<Email for sending reset password messages>
EMAIL_PASS=<Password for sending emalis>

# compile typescript 
tsc 

# run code
node dist/src/app.js
```

### Frontend
```
# clone repo
git clone https://github.com/lemoswilson/tmlssnss

# cd to tmlssnss
cd tmlssnss

# install dependencies
npm install

# set environment variables
# create .env file and set the url for the server, your credentials for CommerceJS, Stripe, and Algolia. 
REACT_APP_SERVER_URL=<SERVER URL>
REACT_APP_CHEC_PUBLIC_KEY=<Your Chec/CommerceJS public key>
REACT_APP_CHEC_PRIVATE_KEY=<Your Chec/CommerceJS private key>
REACT_APP_STRIPE_PUBLIC_KEY=<Your Stripe public key>
REACT_APP_STRIPE_PRIVATE_KEY=<Your Stripe private key>
REACT_APP_ALGOLIA_APP_ID=<Your Algolia App ID>
REACT_APP_PUBLIC_ALGOLIA_SEARCH_KEY=<Your Algolia public search key>

# run the project
npm start
```

# Author

Wilson Lemos

https://lemoswilson.com