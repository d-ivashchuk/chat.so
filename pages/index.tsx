import React from "react";
import { GetServerSideProps } from "next";
import { Layout, Navbar } from "components";
import { Box } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";

type Props = {
  userIp: string;
};

const Index: React.FC<Props> = ({ userIp }) => {
  return (
    <Box>
      <Navbar userIp={userIp} />
      <Layout>
        <Heading>Main app screen</Heading>
      </Layout>
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
