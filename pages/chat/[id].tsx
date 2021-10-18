import React from "react";
import { Box, Heading } from "@chakra-ui/layout";

import { GetServerSideProps } from "next";

import { Layout, Navbar } from "components";

const Chat = ({ userIp }) => {
  return (
    <Box>
      <Navbar userIp={userIp} />
      <Layout>
        <Heading>Chat screen</Heading>
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
