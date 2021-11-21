//firebase init
//Functions: Configure and deploy Cloud Functions
// Create a new project
//npm i express apollo-server-express graphql
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const serviceAccount = require("./yourServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: env.DB_URI,
});

const typeDefs = gql`
  type Cat {
    name: String
    lefespan: String
    weight: String
    description: String
  }

  type Query {
    cats: [Cat]
  }
`;
const resolvers = {
  Query: {
    cats: () => {
      return admin
        .database()
        .ref("cats")
        .once("value")
        .then((snap) => snap.val())
        .then((val) => Object.keys(val).map((key) => val[key]));
    },
  },
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app, path: "/", cors: true });
});
exports.graphql = functions.https.onRequest(app);

//firebase serve
