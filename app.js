const { configDotenv } = require('dotenv')
const resolvers = require('./resolvers');
const express = require("express");
const typeDefs = require('../database_service/graphql/graphqlschema');
const { ApolloServer } = require("apollo-server-express");
const ErrorHandler = require("./utils/ErrorHandler");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Dbconnection = require('../database_service/database/dbconfig/mongodb')
const app = express();




// config dev mode
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "privacy/.env",
    });
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  (async () => {
    await server.start();
    server.applyMiddleware({ app });
  })();
  
  


// calling database connection
Dbconnection()

app.listen(process.env.PORT,()=>{
    console.log( `app is running on http://localhost:${process.env.PORT}`)
