import React from "react";
import { GetServerSideProps } from "next";
import { Layout, Navbar } from "components";
import axios from "axios";
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
      <NewChatModal
        userIp={userIp}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
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
