import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userModel = {
  getUser: async (username: string) => {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  createUser: async (userData: { username: string; password: string }) => {
    return await prisma.user.create({
      data: userData,
    });
  },

  updateRefreshToken: async (username: string, refreshToken: string) => {
    return await prisma.user.update({
      where: { username },
      data: { refreshToken },
    });
  },
};
