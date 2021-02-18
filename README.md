# Fullstack GraphQL-Apollo + NextJS Demo

A blog site. Made for practicing GraphQL + NextJS concepts.

**Frontend:** NextJS + Apollo-Client

**Backend:** Apollo-Server + MongoDB

Features:

1. NextJS

2. GraphQL with Apollo

3. GraphQL Subscriptions

This branch is for **cookie** based authentication.

Using Refresh token + Access Token

The code does not store any refresh token data on the Database.

The only way the token is invalidated is when it expires. The main motivation to do this is so one can see how to handle cookies using Apollo + NextJS, not how to implement more secure Authentication.
