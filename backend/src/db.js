/**
 * This file allows querying/mutating the remote prisma server
 * Prisma is the database and provides the CRUD APIs
 * Yogo-GraphQL is the server side interface to interact with the DB
 *    Yoga-GQL & Prisma are similar to express & mongodb
 */

const {Prisma} = require('prisma-binding');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;