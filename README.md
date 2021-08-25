# Project 4events Back

## 4events APP

Our project consist create an events app to do different actions for example: share my events, check an event as favourite, filter events, chat with other members etc.


## Objectives

The main objective is to create a Wallapop clone that in our case we change products to events.

- Implement the security and authentication concepts to access our API.
- Implement the internationalization of error messages for the front.
- Implement the application endpoints.
- Implement coordinate microservice
- Implement Swagger
- Implement relationship of event entities and users.
- Creation of the necessary models for the application -> Events, Users and Tags.
- Implement the validation endpoints put and post
- Implement tests

## Requisites
- Mongo installed
- Node installed
- Postman to test the api

## Guide before run the project

Go to terminal and put this commands in this order after cloning the project:

```
cd "path of your project"
```

```
npm install
```

```
npm run installDB
```

When done, you can run the project by entering these commands in this order:

```
mongod (to run your database mongo) -> Only if you didn't install mongo without the option to start as Windows service

```

Copy .env.example to .env and review the configuration with your actual data, in this case for JWT auth and connection mongo.


This command is used to run the microservice

```
npm run zipService
```

This command is used to run the project
```
npm run dev
```

The default local port to connect to is : 3000 /` localhost:3000`


## Endpoints API

This service has different endpoints and these are next:

- **GET /api/v1/events:** List all events, and you can filter by tags, title ,price, description, indoor, lat, long, distance_m, userName and you can do a pagination with these filters: limit, start and skip. Also, you can to sort with this filter: sort. Example: /api/v1/events?title=hip-hop&limit=2.....
- **GET /api/v1/events/:_id :** List detail events by param _id
- **POST /api/v1/events/{body params}:** Created new events.
- **PUT /api/v1/events/:_id:** Updated events by param _id
- **DELETE /api/v1/events/:_id :** Deleted events by param _id
- **PUT /api/v1/eventsignup/favsignup:** Add event as favourite
- **DELETE /api/v1/eventsignup/favsignup:** Deleted event as favourite
- **PUT /api/v1/eventsignup/assistsignup:** Assist in some member event
- **DELETE /api/v1/eventsignup/assistsignup:** Deleted your assistant of some member event
- **GET /api/v1/users/:_id :** List detail user by param _id
- **PUT /api/v1/users/:_id :** Updated user by param _id
- **DELETE /api/v1/user/:_id :** Deleted user by param _id
- **GET /api/v1/userId:** List the users _id
- **GET /api/v1/eventsuser/ownevent:** List of events tha the user owns
- **GET /api/v1/eventsuser/assistant:** List of assistant events
- **GET /api/v1/eventsuser/favoriteevent:** List of favourite events
- **POST /api/v1/user/login/{body params}:** Returns a token for a valid user
- **POST /api/v1/user/register/{body params}:** Register a new user
- **POST /api/v1/user/recoverpass:** Recover password
- **GET /api/v1/tags:** List all tags
- **POST /api/v1/events/{body params}:** Events creation.

## To try endpoints with Swagger

We implement API documentation with swagger in our backend project, and you can to try this by localhost:3000/api-doc/;

## Metodologies
In this case We only use one methodology and is this: Refactoring.

## Technologies
We use these technologies:
- Javascript
- Node
- Express
- MongoDB
- Microservices
- Git
- API Rest
- i18n
- Supertest
- Swagger

## Bibliography
 - Keepcoding
 - stackoverflown
 - developer mozilla
 - moongosejs
 - oficial documentation mongodb