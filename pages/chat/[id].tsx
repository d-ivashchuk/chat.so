import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import { Textarea, theme } from "@chakra-ui/react";

import axios from "axios";
import Avatar from "boring-avatars";
import { GetServerSideProps } from "next";

import { useRouter } from "next/dist/client/router";
import { Layout, Navbar } from "components";
import { getNameFromIp } from "utils";
import { format } from "date-fns";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const Chat = ({ userIp }) => {
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const { id } = router.query;

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
            {[
              {
                text: "blah",
                sender: "62.216.56.158",
                createdAd: new Date(),
              },
              {
                text: "test",
                sender: "1.1.1.1.",
                createdAd: new Date(),
              },
              {
                text: " new ",
                sender: "62.216.56.158",
                createdAd: new Date(),
              },
              {
                text: "what",
                sender: "1.4.1.1.",
                createdAd: new Date(),
              },
              {
                text: "Another message",
                sender: "1.3.1.1.",
                createdAd: new Date(),
              },
              {
                text: "hey there",
                sender: "1.1.2.1.",
                createdAd: new Date(),
              },
              {
                text: "what",
                sender: "1.4.1.1.",
                createdAd: new Date(),
              },
              {
                text: "Another message",
                sender: "1.3.1.1.",
                createdAd: new Date(),
              },
              {
                text: "hey there",
                sender: "1.1.2.1.",
                createdAd: new Date(),
              },
            ].map((message) => {
              return (
                <HStack mx={4} mb={4}>
                  {message.sender !== userIp && (
                    <Avatar
                      size={40}
                      name={message.sender}
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
                    ml="auto"
                    color="gray.500"
                    borderRadius={8}
                    minW={200}
                    px={2}
                    py={3}
                    boxShadow={theme.shadows.md}
                  >
                    {message.text}
                  </Text>
                </HStack>
              );
            })}
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
              onClick={() => console.log(message)}
            />
          </HStack>
        </Flex>
      </Layout>
    </Box>
  );
};

export default Chat;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get("https://geolocation-db.com/json/");
  const userIpData = res.data as { IPv4: string };

  return {
    props: { userIp: userIpData.IPv4 },
  };
};
