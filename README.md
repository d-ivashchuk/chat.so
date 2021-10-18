<br />

<div align="center">
  <h1>E2E type-safe app example - Live chat 💬</h1>
  <p><h3 align="center">Technologies used ⚙️</h3></p>
  <a href="https://nextjs.org/">Next.js</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.prisma.io/">Prisma</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://pusher.com/">Pusher</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://chakra-ui.com/">chakra-ui</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://react-query.tanstack.com/">react-query</a>
</div>

## Tutorial

> This project is a part of the tutorial blog-post - learn **here** about intricacies of building E2E type-safe app!

## Running the project locally 

The local version of the app can utilise docker managed db. To start the database make sure that you have [docker installed](https://www.docker.com/products/docker-desktop) & running on your machine together with docker-compose. 

First copy the contents of the `.example.env` into `.env` file to make sure that you have all environment variables specified. You might need to create a Pusher app to get pusher related keys & secrets.

To run the project including the DB execute the following commands

```console
yarn install //install dependencies 
docker-compose up -d //run database
npx prisma migrate dev //sync your database with Prisma schema and generate Prisma client
yarn run dev //to run the next.js app
```

You app shall be listening for code changes at `localhost:3000`