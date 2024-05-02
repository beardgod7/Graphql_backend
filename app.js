const dotenv  = require('dotenv')
const resolvers = require('../Graphql_backend/graphql/resolver');
const express = require("express");
const typeDefs = require('../Graphql_backend/database/graphqlschema/graphschema');
const { ApolloServer } = require("apollo-server-express");
const Dbconnection = require('../Graphql_backend/database/dbconfig/mongodb')
const app = express();

dotenv.config(); 



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
})
