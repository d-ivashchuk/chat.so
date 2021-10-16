import faker from "faker";

export const getNameFromIp = (ip: string) => {
  faker.seed(Number(ip.split(".").join("")));

  const name = faker.animal.type();
  const adjective = faker.commerce.color();
  return `${adjective} ${name}`;
};
