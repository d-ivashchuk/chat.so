import * as React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import Avatar from "boring-avatars";

import faker from "faker";
import { Logo } from "components/logo";
import { useRouter } from "next/dist/client/router";

type Props = {
  userIp: string;
};

export const Navbar = ({ userIp }: Props) => {
  const router = useRouter();

  const getNameFromIp = (ip: string) => {
    faker.seed(Number(ip.split(".").join("")));

    const name = faker.animal.type();
    const adjective = faker.commerce.color();
    return `${adjective} ${name}`;
  };

  return (
    <Box as="header" borderBottomWidth="1px" backgroundColor="white">
      <Box maxW="7xl" mx="auto" py="4" px={{ base: "6", md: "8" }}>
        <HStack spacing="8" justifyContent="space-between" alignItems="center">
          <Box cursor="pointer">
            <HStack>
              <Logo onClick={() => router.push("/", null, { shallow: true })} />
            </HStack>
          </Box>
          <HStack>
            <Avatar
              size={40}
              name={userIp}
              variant="beam"
              colors={["#FFC2CE", "#80B3FF", "#FD6E8A", "#A2122F", "#693726"]}
            />
            <Text fontWeight="bold" textTransform="capitalize">
              {getNameFromIp(userIp)}
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
