import React from "react";
import { GetServerSideProps } from "next";
import { Layout, Navbar } from "components";
import axios from "axios";
import { Box, Center, Flex, Heading, SimpleGrid } from "@chakra-ui/layout";
import { Button, Spinner, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import Avatar from "boring-avatars";
import Link from "next/link";
import NewChatModal from "components/new-chat-modal";

type Props = {
  userIp: string;
};

const Index: React.FC<Props> = ({ userIp }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          {!false ? (
            [
              {
                id: 123,
                name: "Great chat",
                createdAt: new Date(),
                createdBy: "1.1.1.1",
              },
              {
                id: 133,
                name: "Another live chat",
                createdAt: new Date(),
                createdBy: "1.1.1.1",
              },
              {
                id: 143,
                name: "Another beautiful chat",
                createdAt: new Date(),
                createdBy: "1.1.1.1",
              },
            ].map((chat) => {
              return (
                <Box
                  placeSelf="center"
                  borderRadius={4}
                  backgroundColor={colorMode === "light" ? "white" : "gray.700"}
                  boxShadow="rgb(0 0 0 / 8%) 0px 1px 4px"
                  px={4}
                  py={2}
                  key={chat.id}
                  minW={500}
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
      <NewChatModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get("https://geolocation-db.com/json/");
  const userIpData = res.data as { IPv4: string };

  return {
    props: { userIp: userIpData.IPv4 },
  };
};

export default Index;
