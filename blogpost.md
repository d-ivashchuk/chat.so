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

<br />

## Table of Contents
- **[Prerequisites ✅](#prerequisites)**<br>
- **[What you will be able to build 🤩](#what-you-will-be-able-to-build-)**<br>
- **[How do we architect it 🏗](#how-do-we-architect-it-)**<br>
- **[Next.js project setup ⬛️](#nextjs-project-setup)**<br>
- **[Using prisma to generate client & types ◮](#using-prisma-to-generate-client--types)**<br>
- **[Creating mutaions with react-query  ⤴️](#creating-mutations-with-react-query)**<br>
- **[Creating queries with react-query ⤵️](#creating-queries-with-react-query)**<br>
- **[Making our app come to life inside of React code 🚀](#making-our-app-come-to-life-inside-react-code-)**<br>
- **[Adding real time functionalities 💬](#adding-real-time-functionalities-with-pusher-on-the-frontend)**<br>
- **[Closing words ✨](#closing-words)**<br>

<hr/>


One of the main goals of any software product that runs in a production mode is the ability to sustain time. With time new features are added, new bugs are introduced and new maintenance challenges are raised - to make matters worse, the codebase itself is seldomly getting thinner, it only grows further and makes it even more painful for developers to manage it. 

Long-term maintenance problem is already being solved at many levels in JavaScript ecosystem - [writing useful tests](https://kentcdodds.com/blog/write-tests), [typing your app](https://www.typescriptlang.org/) and many more tactical approaches for keeping code bases leaner & flexible for the change.

In this tutorial we will learn how to make it **even better** by provisioning a single source of truth for the most of our application types across the whole app architecture. Enter [Prisma](https://prisma.io). 

## Prerequisites

This tutorial is stripped of many of the complicated topics to demonstrate the E2E typing flow - although you'll still need to know the moderate amount of:

- React
- Typescript
- Next.js

To the lesser extent the following technologies:
- Prisma 
- React-query
- Relational databases

## What you will be able to build 🤩

Live Chat application that allows any user to connect to it, create new chat or join the existing one and start chatting with others.

https://user-images.githubusercontent.com/29632358/137722031-68d43065-a201-4d58-8f67-a200da520a90.mp4

The project is available **live** here:

[https://chat-so.vercel.app](https://chat-so.vercel.app)

You could find the code for it here:

[https://github.com/d-ivashchuk/chat.so](https://github.com/d-ivashchuk/chat.so)

## How do we architect it 🏗

- Next.js application powering both our **frontend** & **backend(api routes)**
- React query to manage server-side state
- PostgresQL database managed by strict Prisma schema
- Vercel for deployment and serverless functions
- Pusher for managed web-sockets

## Let's go 🚀
Let's start with cloning the [https://github.com/d-ivashchuk/chat.so/tree/starter](starer branch of the project)! We have a bare minimum setup that holds the most important dependencies for us not to care. Let's give it a quick glance.

Copy the contents of `.example.env` into a `.env`(you need to create it) and populate the correct environmental variables there. You need to create a new [Pusher](https://pusher.com/channels) app to get the app keys & secrets.

After you have successfully done the previous step - you can install the dependencies by running `yarn run dev`

### ‼️ Remember ‼️

If you at some point struggle with the following the tutorial - [https://github.com/d-ivashchuk/chat.so](the finished code is here) and you could verify how yours is different and hopefully learn more about the nature of the problem!

## Next.js project setup

`package.json` - the heart of our whole application 💛

 `Scripts` - to run app locally & deploy it to Vercel. `dev` is used for local development. `vercel-build` for deploy command on Vercel.

```json
{
  "name": "hello-next", 
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "license": "MIT",
  "author": "",
  "main": "index.js",
 
  "scripts": { 
    "dev": "next", 
    "build": "next build",
    "start": "next start",
    "vercel-build": "prisma generate && prisma migrate deploy && next build" 
  },
  "dependencies": {
    "@chakra-ui/icons": "^1.0.16",
    "@chakra-ui/react": "^1.6.10",
    "@emotion/react": "^11",
    "@emotion/styled": "^11",
    "@harelpls/use-pusher": "^7.2.1",
    "@prisma/client": "3.2.1",
    "axios": "0.21.4",
    "boring-avatars": "^1.5.8",
    "date-fns": "^2.25.0",
    "faker": "^5.5.3",
    "framer-motion": "^4",
    "next": "^11.1.2",
    "nextjs-progressbar": "^0.0.11",
    "pusher": "^5.0.0",
    "pusher-js": "^7.0.3",
    "random-word-slugs": "^0.1.5",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-hot-toast": "^2.1.1",
    "react-markdown": "7.0.1",
    "react-query": "^3.27.0"
  },
  "devDependencies": {
    "@types/node": "16.4.2",
    "@types/react": "17.0.30",
    "eslint": "7.32.0",
    "eslint-config-next": "11.1.2",
    "prisma": "3.2.1",
    "ts-node": "10.3.0",
    "typescript": "4.4.4"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```
`_app.tsx` - main entry point of our Next.js application. 

Here we have couple of things going on, let's look at the inline code comments!

```tsx
import React from "react";
import NextNprogress from "nextjs-progressbar";
import type { AppProps } from "next/app";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { PusherProvider } from "@harelpls/use-pusher";

import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient()); // instantiate new React Query client provider - we will use it to communicate with our backend from frontend components

  const pusherConfig = {
    clientKey: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  }; // pusher related configs using environmental variables. You will need to get them yourself from a new Pusher app if you decide to run the app locally.

  // Chakra provider - gives our app chakra-ui styles
  // Pusher provider - allows our app to communicate with live web-sockets
  // QueryClientProvider - allows us to easily communicate with our serverless functions from the frontend
  // Toaster  - allows us to use react-hooks for fancy toast notifications 

  return (
    <ChakraProvider>
      <PusherProvider {...pusherConfig}>
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <NextNprogress
              color={theme.colors.blue[400]}
              startPosition={0.3}
              stopDelayMs={200}
              height={2}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
            <div>
              <Toaster />
            </div>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PusherProvider>
    </ChakraProvider>
  );
}
export default MyApp;
```

We also have couple of pages already that we will use to build our application. 

`index.tsx` is the main entry point accessible at the root of our app - `localhost:3000/`. We will build the chat list here.

`chat/[id].tsx` is a [https://nextjs.org/docs/routing/dynamic-routes](dynamic next route) accessible at `localhost:3000/chat/123`. We will build the actual chat here.

## Using prisma to generate client & types

Enough of the setup - let's get our hands dirty! So you are probably eager to know already - what's that E2E type safety, what will serve as our single source of truth for our app types? I already gave you a sneak peek earlier - we will use Prisma to drive our main application types!

Let's create the prisma folder at the root of our application by running:

```console
npx prisma init
```

This creates `schema.prisma` file that we want to modify in the following way 👇🏼


```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Chat {
  id        String   @id @default(cuid())
  name      String
  userIp    String
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")


  messages Message[]
  @@map(name: "chats")
}

model Message {
  id        String   @id @default(cuid())
  text      String
  userIp    String
  chatId    String
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")

  chat Chat @relation(fields: [chatId], references: [id])
}
```

Let's make sense out of it piece by piece.

The following part is a mere setup where we tell Prisma that we want to use `postgresql` db & it will be accessible at the particular destination - here we specify that our database connection string is living in `.env` file. You are also most welcome to use any other SQL db provider for this tutorial and host the database wherever you want! Here is the example of how to do this [in sqlite](https://www.prisma.io/docs/concepts/database-connectors/sqlite).

Namely we should have `DATABASE_URL=postgresql://postgres:secret@localhost:5432/pg?schema=public` there, if you choose to run the database in docker by running `docker-compose up -d` at the root of the project. I've prepared a little `docker-compose` file to make your life little bit easier!

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Here goes the schema for the business logic of our app:

We have `Chat` table that has the following columns - id(**autogenerated**) [with @ attributes](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#attributes), name, userIp which is simple the ip address of the user who creates the chat, updateAt & createdAt(**autogenerated**) and finally the link to another table `messages` - this tells prisma that one chat can have multiple messages associated with it. Sound logical so far, right? 😀


```prisma
model Chat {
  id        String   @id @default(cuid())
  name      String
  userIp    String
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")


  messages Message[]
  @@map(name: "chats")
}
```

We have `Message` table that has the following columns - id(**autogenerated**) text(**actual message text**), userIp which is simple the ip address of the user who sends the message to the chat, updateAt & createdAt(**autogenerated**) and finally the link to another table chat which paired with chatId that serves as a foreign key to `Chat` table - this tells prisma that one message can be associated with a particular chat!

```prisma
model Message {
  id        String   @id @default(cuid())
  text      String
  userIp    String
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")
  chatId    String

  chat Chat @relation(fields: [chatId], references: [id])
}
```

That's all that Prisma needs to impose a strict schema onto our database. Moreover - it will also generate two other important things for us! **Client** that we will use to communicate with our database(it offers an amazing developer experience by being strictly typed based on our schema, so we can't do wrong without our editor yelling at us) and **Types** that we will use all over our application to achieve **E2E type safety!**

Let's generate those now by running the following command in the terminal:

```console
npx prisma migrate dev --name init
```

This will create an initial database migration for us and generate the things I've already mentioned above.

Let's bring it one step further and seed our database so we don't look at empty screens when we start our application! To do this let's create `seed.ts` in prisma folder with the following contents:

```typescript
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const chatData: Prisma.ChatCreateInput[] = [
  {
    name: "Great chat",
    userIp: "62.216.56.158",
    messages: {
      create: [
        {
          text: "Hey there",
          userIp: "62.216.56.158",
        },
        {
          text: "This is a live chat",
          userIp: "62.216.56.158",
        },
        {
          text: "Try it out",
          userIp: "62.216.56.158",
        },
        {
          text: "Random strangers could join and chat with you here :D ",
          userIp: "62.216.56.158",
        },
      ],
    },
  },
  {
    name: "Another awesome chat",
    userIp: "62.216.56.158",
    messages: {
      create: [
        {
          text: "Woot",
          userIp: "62.216.56.158",
        },
        {
          text: "We are live!!!",
          userIp: "62.216.56.158",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const chat of chatData) {
    const createdChat = await prisma.chat.create({
      data: chat,
    });
    console.log(`Created chat with id: ${createdChat.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

In this file we are already utilizing types generated by prisma. Take a look at `Prisma.ChatCreateInput[]` - this will make sure that when we are building the seeded objects we won't be able to make a mistake in a variable name or pass something to prisma that it is not able to accept. Just try it and see the magic for yourself 🧙🏼‍♂️

Then we are just calling async function that uses prisma client to create chats with populated messages for us.

```ts
 const createdChat = await prisma.chat.create({
      data: chat,
    });
```

We are all set - let's run `npx prisma db seed` and you should see the message that our chats have been successfully created.

<p align="center">
<img width="536" alt="Screenshot 2021-10-18 at 13 31 40" src="https://user-images.githubusercontent.com/29632358/137722519-0beb6180-d33b-4e42-90ab-53e7df9748cb.png">
</p>


To verify it even further you could use another awesome tool from prisma ecosystem called `Prisma Studio`. It will allow your to explore your tables content in a beautiful visual editor. 

Let's run `npx prisma studio` to launch it! 

<p align="center">
<img width="558" alt="Screenshot 2021-10-18 at 13 32 54" src="https://user-images.githubusercontent.com/29632358/137722692-d1d23542-fc33-4000-807a-67f275bee789.png">
</p>

<p align="center">
<img width="1263" alt="Screenshot 2021-10-18 at 13 33 24" src="https://user-images.githubusercontent.com/29632358/137722728-3898c515-0cfb-4d3b-b784-a1d5b130823b.png">
</p>

## Creating mutations with react-query

We have finished with our schema definition and type generation which means we could start building the backend for our application. Let's get straight to that.

So far in your `hooks` folder you only have one exported hook - `useAppUrl()` that will come quite handy to see in which environment we are actually running our app.


```ts
const getAppUrl = () =>
  (process.env.NODE_ENV === "development" && "http://localhost:3000") ||
  (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_URL) ||
  "http://localhost:3000";

const useAppUrl = () => {
  return getAppUrl();
};

export { useAppUrl, getAppUrl };
```

If you will end up hosting this app which I more than welcome - you will need to provide the correct `NEXT_PUBLIC_URL` that will point at the url that you host your app at.

I usually like to start with mutations which is an operation designed to modify data in the data store and to return a value.

In the `hooks` folder let's create `mutations` folder & create two subdirectories with names `useCreateChatMutation` & `useSendMessageMutation`. Let's create `index.ts` files in both of them - this will serve as a basis for our hooks that we will use to modify the data!

In `useCreateChatMutation` we already start using our prisma generated types to make sure that our IDE notifies us of any erroneous variables that we try to pass to the mutation.
```ts
import { Prisma } from "@prisma/client";
import { useAppUrl } from "hooks/useAppUrl";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Chat } from ".prisma/client";

const useCreateChatMutation = () => {
  const appUrl = useAppUrl();
  const queryClient = useQueryClient();

  return useMutation(
    // note Prisma.ChatCreateInput & Promise<Chat>. This way we tell typescript that whenever we pass variables to this react-query mutation we want precisely ChatCreateInput & everytime this promise resolves it will return us a Chat.
    async (variables: Prisma.ChatCreateInput): Promise<Chat> => {
      const response = await axios.post(
        `${appUrl}/api/chat/create?name=${variables.name}&userIp=${variables.userIp}`
      );

      return response.data.chat;
    },
    {
      onSuccess: async () => {
        // we will get to queries a little bit later but just for you to know - whenever user creates a new chat, we will trigger a new request to the server to fetch all the chats including the new one so user sees most up to date state of db.
        await queryClient.refetchQueries(["chats"]);
      },
      onError: (error) => {
        toast.error("Something went wrong", error);
      },
    }
  );
};

export { useCreateChatMutation };
```

Although the above code is an awesome abstraction to be used in react it still does not do anything as we did not create a serverless function to actually create a chat!

In `pages` folder let's create a sub directory called `chat`, within `chat` directory let's create a subdirectory called `create` and finally let's add `index.ts` in `create` folder.

In the `index.ts` file:

```ts
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import Pusher from "pusher";

export default async function handle(req, res) {
  try {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    const { name, userIp } = req.query as Prisma.ChatCreateInput;

    const chat = await prisma.chat.create({
      data: {
        name,
        userIp,
      },
    });

    pusher.trigger("chat.so", "create-chat", {
      chat,
    });

    res.json({ chat });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
```

Here we have couple of things going on:

1. Pusher related code will be responsible for triggering events that we will later listen on in our frontend code to dynamically update our state with newly created chats. If you haven't completed the step of adding Pusher env vars into project it's a high time. If you don't want to add the realtime functionalities just yet, just comment out the pusher related code 😊
2. We are using prisma client to create new chat and our serverless function accepts two things as the query params - `name` & `userIp` both are strictly typed by `Prisma.ChatCreateInput` so if you decide to destructure `foo`, `age` or any other variable that prisma client does not accept - you will have an error! 

We have already established the two way type safety here by the way! Congrats 🚀 Our database & our server are now having **strict contract** which means that if we decide to change something in our prisma schema - we will have errors all over the code and would be able to fix it!

Let's finish with the mutations and create a new react-query mutation in `useSendMessageMutation/index.ts`. You are already familiar with most of the code here apart from the fact that we are passing our variables as body to the request and not as query params.

```ts
import { Prisma } from "@prisma/client";
import { useAppUrl } from "hooks/useAppUrl";
import { useMutation } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Message } from ".prisma/client";

const useSendMessageMutation = () => {
  const appUrl = useAppUrl();
  return useMutation(
    async (variables: Prisma.MessageCreateInput): Promise<Message> => {
      const response = await axios.post(`${appUrl}/api/message/send`, {
        text: variables.text,
        userIp: variables.userIp,
        chat: variables.chat,
      });

      return response.data.message;
    },
    {
      onError: (error) => {
        if (error) {
          toast.error("Something went wrong");
        }
      },
    }
  );
};

export { useSendMessageMutation };
```
In `pages/api/message/send/index.ts` let's add the following code. Again you are mostly familiar with all of the compounds of this file!

```ts
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import Pusher from "pusher";

export default async function handle(req, res) {
  try {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    const { text, userIp, chat } = req.body as Prisma.MessageCreateInput;

    const message = await prisma.message.create({
      data: {
        text,
        userIp,
        chat,
      },
    });


    const result = await pusher.trigger("chat.so", "send-message", {
      message,
    });

    res.json({ message });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
```

## Creating queries with react-query 

We have a way of modifying the data in our database from react components - but we still are missing the crucial part of any application - fetching data. Let's implement some queries - those from react-query are used to request some data from the server. React query offers a useful abstraction on managing the cache and invalidation thereof which makes the UX far better.

As with mutations let's create `queries` subdirectory in the `hooks` folder. In a fashion we did this with mutations let's create two folders `useChatMessages` & `useChats`.

Inside of `useChats` folder let's create an `index.ts` file with the following content. At this stage of tutorial you shall be quite familiar with what we are doing apart from `useQuery` hook from `react-query` - as the first param it accepts the array of keys which is used under the hood by `react-query` to understand if this query shall be refetched or not. Do you remember our `await queryClient.refetchQueries(["chats"]);` - that's exactly where we use the key.

```ts
import { Chat } from ".prisma/client";
import axios from "axios";

import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchChats = async (appUrl: string): Promise<ReadonlyArray<Chat>> => {
  const response = await axios.get(`${appUrl}/api/chats`);

  return response.data.chats;
};

const useChats = () => {
  const appUrl = useAppUrl();
  return useQuery(["chats"], () => fetchChats(appUrl), {
    refetchOnWindowFocus: true,
  });
};

export { useChats };
```

Again our hook does not have a related API to speak with, let's create `pages/api/chats/index.ts` and inside `index.ts` write the following code. Quite minimal, isn't it? 😀 This is the power of prisma & next.js api routes!

```ts
import prisma from "lib/prisma";

export default async function handle(_, res) {
  try {
    const chats = await prisma.chat.findMany();

    res.json({ chats });
  } catch (error) {
    console.log(error);
  }
}
```

In a similar fashion let's finish with adding query for our chat messages. Inside `hooks/queries/useChatMessages/index.ts` let's add the following. Note how we are using types from `prisma/client` once again to make our lives easier now editing the code and most of all make our lives easier in maintaining this code later!

```ts
import { Chat, Message } from ".prisma/client";
import axios from "axios";

import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchMessages = async (
  appUrl: string,
  chatId: Chat["id"]
): Promise<ReadonlyArray<Message>> => {
  const response = await axios.get(`${appUrl}/api/chat-messages/${chatId}`);

  return response.data.messagesByChat;
};

const useChatMessages = ({ chatId }: { chatId: Chat["id"] }) => {
  const appUrl = useAppUrl();

  return useQuery(
    ["chatMessages", chatId],
    () => fetchMessages(appUrl, chatId),
    {
      refetchOnWindowFocus: true,
    }
  );
};

export { useChatMessages };
```

We are on the finish line with creating the backend for our application, congrats 🔥 Let's add one last server router by creating `pages/api/chat-messages/[id].ts`. This is a dynamic route here as you see in the code above it calls `/api/chat-messages/${chatId}` and that is why we need to include `[id]` so next.js is aware of it.

Inside `[id].ts`

```ts
import { Chat } from ".prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  try {
    const { id } = req.query as Chat;

    const messagesByChat = await prisma.message.findMany({
      where: {
        chatId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json({ messagesByChat });
  } catch (error) {
    console.log(error);
  }
}
```

## Making our app come to life inside React code 🙌🏼

Our app now has it's backend and you could already test it with tools like postman(link) but it's not fun, right? Let's spice it up with some cool UI!

Inside of your `pages/index.tsx` we will use the following code that we will go trough now!

```tsx
import React from "react";
import { GetServerSideProps } from "next";
import { Layout, Navbar } from "components";
import { Box, Center, Flex, Heading, SimpleGrid } from "@chakra-ui/layout";
import { Button, Spinner, useColorMode, useDisclosure } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import Link from "next/link";
import NewChatModal from "components/new-chat-modal";
import { useChats } from "hooks";

type Props = {
  userIp: string;
};

const Index: React.FC<Props> = ({ userIp }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: chats, isLoading } = useChats();

  return (
    <Box>
      <Navbar userIp={userIp} />
      <Layout>
        <SimpleGrid columns={1} pt={5} gridGap={2}>
          <Center mb={4}>
            <Button colorScheme="twitter" mt={4} onClick={onOpen}>
              Create new chat
            </Button>
          </Center>
          {!isLoading ? (
            chats?.map((chat) => {
              return (
                <Box
                  placeSelf="center"
                  borderRadius={4}
                  backgroundColor={colorMode === "light" ? "white" : "gray.700"}
                  boxShadow="rgb(0 0 0 / 8%) 0px 1px 4px"
                  px={4}
                  py={2}
                  key={chat.id}
                  width="100%"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Avatar
                          size={40}
                          name={chat.name}
                          variant="marble"
                          colors={[
                            "#FFC2CE",
                            "#80B3FF",
                            "#FD6E8A",
                            "#A2122F",
                            "#693726",
                          ]}
                        />
                      </Box>
                      <Box>
                        <Heading fontSize="md">{chat.name}</Heading>
                      </Box>
                    </Flex>
                    <Box
                      color="blue.400"
                      sx={{
                        "a:hover": {
                          color: "blue.500",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Link href={"chat/[id]"} as={`chat/${chat.id}`}>
                        Join chat ⏩
                      </Link>
                    </Box>
                  </Flex>
                </Box>
              );
            })
          ) : (
            <Center>
              <Spinner mt={10} color="gray.600" />
            </Center>
          )}
        </SimpleGrid>
      </Layout>
      <NewChatModal userIp={userIp} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      userIp:
        process.env.NODE_ENV === "development"
          ? "1.1.1.1"
          : context.req?.headers["x-real-ip"],
    },
  };
};

export default Index;
```

Inside of `getServerSideProps` which is situated at the very bottom of the file we are getting the real IP of the user. In local development we don't need that so we just get `1.1.1.1` as the placeholder, but for the production version as this app is intended to run on Vercel(link) we'd need to get the real user IP and not the IP of the request which will always be the same due to the fact how serverless works.

Now we are finally starting to use those hooks we wrote some time ago.
```tsx
const { data: chats, isLoading } = useChats();
```
Note that while we are using chats - it's fully typed already. And this is the third and final component of the E2E type safe apps, our frontend is actually consuming the schema generated on the database level. Whenever you will access the `chat` your IDE will autocomplete it's properties for you and will yell at you when they are not correct.

To make everything interactive we are using this modal. 

```tsx
<NewChatModal userIp={userIp} isOpen={isOpen} onClose={onClose} />
```

Let's implement it in the `components/new-chat-modal/index.tsx`

```tsx
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { useCreateChatMutation } from "hooks/mutations/useCreateChatMutation";

const NewChatModal = ({ isOpen, onClose, userIp }) => {
  const [name, setName] = useState("");
  const createChatMutation = useCreateChatMutation();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="first-name" isRequired>
              <FormLabel>Name of the chat</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!name}
              colorScheme="twitter"
              mr={3}
              onClick={async () => {
                await createChatMutation.mutate({
                  name,
                  userIp,
                });
                onClose();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChatModal;
```

This Modal when opened will allow our users to input the name of the chat and create it. We are using one of our mutations hooks here:

```ts
 const createChatMutation = useCreateChatMutation();
```

In the below button we are actually triggering the mutation with passing our variables(strictly typed by prisma types), so if you try to pass something that prisma can't accept - typescript will start yelling at us.

```tsx
<Button
    isDisabled={!name}
    colorScheme="twitter"
    mr={3}
    onClick={async () => {
      await createChatMutation.mutate({
        name,
        userIp,
      });
      onClose();
    }}
  >
    Add
</Button>
```

## Adding real-time functionalities with Pusher on the frontend 

We are having the ability to create new chats and we can enter those chats - but our dynamic chat component situated in `pages/chat/[id].tsx` does nothing for now. Let's add some magic with Pusher!

```tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import { Icon, Spinner, Textarea } from "@chakra-ui/react";

import Avatar from "boring-avatars";
import { GetServerSideProps } from "next";

import { useRouter } from "next/dist/client/router";
import { Layout, Navbar } from "components";
import { getNameFromIp } from "utils";
import { format } from "date-fns";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { useChatMessages } from "hooks";
import { useSendMessageMutation } from "hooks/mutations/useSendMessageMutation";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Message } from "@prisma/client";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import Link from "next/link";

const Chat = ({ userIp }) => {
  const router = useRouter();
  const channel = useChannel("chat.so");
  const queryClient = useQueryClient();
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef(null);

  useEvent(channel, "send-message", ({ message }: { message: Message }) => {
    if (!router.asPath.includes(message.chatId)) {
      toast.custom(
        <Box
          backgroundColor="white"
          px={3}
          py={4}
          boxShadow="0 3px 10px rgb(0 0 0 / 10%), 0 3px 3px rgb(0 0 0 / 5%)"
          borderRadius={4}
        >
          <HStack>
            <Icon as={CheckIcon} w={4} h={4} color="green.400" />
            <Text>
              New message in a chat!.
              <Box
                sx={{
                  a: {
                    color: "blue.400",
                  },
                }}
              >
                <Link href={"/chat/[id]"} as={`/chat/${message.chatId}`}>
                  {message.chatId}
                </Link>
              </Box>
            </Text>
          </HStack>
        </Box>,
        { duration: 4000 }
      );
    }
    queryClient.refetchQueries("chatMessages");
  });

  const sendMessageMutation = useSendMessageMutation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const { data: messagesByChat, isLoading } = useChatMessages({
    chatId: router.query.id as string,
  });

  return (
    <Box>
      <Navbar userIp={userIp} />
      <Layout>
        <Flex
          borderRadius={4}
          mt={2}
          mb={2}
          px={4}
          py={2}
          backgroundColor="white"
        >
          <HStack>
            <IconButton
              aria-label="back"
              size="md"
              borderRadius={50}
              onClick={() => router.push("/")}
              icon={<ArrowBackIcon />}
            />
            <Avatar
              size={40}
              name={userIp}
              variant="beam"
              colors={["#FFC2CE", "#80B3FF", "#FD6E8A", "#A2122F", "#693726"]}
            />
            <VStack spacing={0} alignItems="left">
              <Text fontWeight="bold" textTransform="capitalize">
                {getNameFromIp(userIp)}
              </Text>
              <Text color="gray.500" fontSize={12}>
                {format(time, "Pp")}
              </Text>
            </VStack>
          </HStack>
        </Flex>
        <Flex
          direction="column"
          minHeight="40vh"
          justifyContent="space-between"
          borderRadius={4}
          p={5}
          backgroundColor="white"
        >
          <Box maxH={300} overflow="auto" pb={4}>
            {!isLoading ? (
              messagesByChat?.map((message) => {
                return (
                  <HStack key={message.id} mx={4} mb={4}>
                    {message.userIp !== userIp && (
                      <Avatar
                        size={40}
                        name={message.userIp}
                        variant="beam"
                        colors={[
                          "#FFC2CE",
                          "#80B3FF",
                          "#FD6E8A",
                          "#A2122F",
                          "#693726",
                        ]}
                      />
                    )}
                    <Text
                      backgroundColor="gray.200"
                      ml="auto"
                      color="gray.500"
                      borderRadius={8}
                      minW={200}
                      px={4}
                      py={3}
                      border="1px solid white"
                    >
                      {message.text}
                    </Text>
                  </HStack>
                );
              })
            ) : (
              <Spinner />
            )}
            <Box ref={lastMessageRef} />
          </Box>
          <HStack mt={4}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
              aria-label="back"
              size="md"
              borderRadius={50}
              icon={<ArrowForwardIcon />}
              onClick={async () => {
                await sendMessageMutation.mutate({
                  text: message,
                  userIp,
                  chat: {
                    connect: {
                      id: router.query.id as string,
                    },
                  },
                });
                setMessage("");
              }}
            />
          </HStack>
        </Flex>
      </Layout>
    </Box>
  );
};

export default Chat;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      userIp:
        process.env.NODE_ENV === "development"
          ? "1.1.1.1"
          : context.req?.headers["x-real-ip"],
    },
  };
};
```

Let's go trough the most important React hooks first:

```tsx
 const sendMessageMutation = useSendMessageMutation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const { data: messagesByChat, isLoading } = useChatMessages({
    chatId: router.query.id as string,
  });
```

`sendMessageMutation` is the mutation hook we wrote some time ago and it's responsible for writing the message into our database.

`useEffect` that uses intervals is here to just update the time on the chat

`useEffect` with ref is used to scroll to the last message in the chat when it's opened

`useChatMessages` is a query hook and it is responsible for fetching the messages from the server

```tsx
useEvent(channel, "send-message", ({ message }: { message: Message }) => {
    if (!router.asPath.includes(message.chatId)) {
      toast.custom(
        <Box
          backgroundColor="white"
          px={3}
          py={4}
          boxShadow="0 3px 10px rgb(0 0 0 / 10%), 0 3px 3px rgb(0 0 0 / 5%)"
          borderRadius={4}
        >
          <HStack>
            <Icon as={CheckIcon} w={4} h={4} color="green.400" />
            <Text>
              New message in a chat!.
              <Box
                sx={{
                  a: {
                    color: "blue.400",
                  },
                }}
              >
                <Link href={"/chat/[id]"} as={`/chat/${message.chatId}`}>
                  {message.chatId}
                </Link>
              </Box>
            </Text>
          </HStack>
        </Box>,
        { duration: 4000 }
      );
    }
    queryClient.refetchQueries("chatMessages");
  });
```

`useEvent` hook is responsible for refetching the `chatMessages` whenever user sends message and it will also send the toast message when user is not currently in the chat where that message has been sent.

## Closing words

Congrats for making it till the end 🎉🎉🎉 Now you can deploy the app to Vercel, just remember to get all the environment variables created there as you have created them locally.
This app is very barebone when it comes to functionalities and UX but hopefully it demonstrates well how to build E2E type-safe application with prisma & typescript.

You could evolve it in many ways by adding proper error-handling, indicators when users type the messages or even auth to persist the users in the database. Most importantly whenever you will evolve your prisma schema and it will introduce some breaking changes your IDE will immediately tell you about where the problem is and you will be able to fix the incoherences fast. Cheers and let me know if this tutorial was useful! If you have any questions or got stuck with something feel free to reach out to me on Twitter @divdev_. 


