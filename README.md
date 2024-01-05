# Grqphql API with Prisma

## Node version: v18.14.2

## What's in here?

This is a graphql api built with apollo-server, prisma and postgres.
The requirements weren't very specific, so I might have gone a bit out of scope. But I suppose the purpose was to familiarize with graphql and prisma, so it was a good exercise.

After starting the app, I advise you to pick a user with `isSysAdmin: true` as simple users can't do much, apart from updating their details.
You can use the `login` mutation to get a token, then use it in the `x-session-id` header to access the other mutations / queries.

## Start

```bash
git clone https://github.com/adpopescu338/api-uni && cd api-uni
```

Then:

```bash
chmod +x ./scripts/startAll.sh
./scripts/startAll.sh
```

This will start the gql server, the postgres db and the redis server.
It uses docker-compose, so you need to have it installed.
When it's done, you can seed the db so you have some users to play with:

```bash
yarn seed
```

You can now open localhost:3000 and explore the api.
The password for all users is `password`.
You can pick any email from the db.
To explore the db, just run `yarn prisma studio`.

## Local dev

Rename `.env.example` to `.env`. You can leave the values as they are.
Then run `yarn` to install the dependencies.

To start the database and redis, you can use the script:

```bash
chmod +x ./scripts/startRedisAndPostgres
./scripts/startRedisAndPostgres
```
Then run the migrations with `yarn prisma migrate deploy`.
Then you can start the server with `yarn dev`.

## Test

```bash
yarn jest
```

## What's next?

#### Custom graphql directives

I tried adding 2 custom directives `@authenticated` and `@sysadmin`, but for some reason the request is never reaching the resolver. I spent a few hours trying to debug, then I preferred to move on. I'll get back to it if I have more time.

#### Prisma and graphql

It feels a bit weird to kinda duplicate definitions in the schema.prisma and the graphql schema, so if I have any time I'll explore this interesting library: https://prisma.typegraphql.com
