const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
// implement Apollo Server and apply it to the Express server as middleware.
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

// implement Apollo Server and apply it to the Express server as middleware.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// implement Apollo Server and apply it to the Express server as middleware.
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
