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
    console.log(123);
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
