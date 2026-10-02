import { prisma } from "@/lib/prisma";

import {
  createSessionToken,
  getSessionExpiryDate,
  hashSessionToken,
} from "./session";

export async function createSession(userId) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = getSessionExpiryDate();

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
}

export async function getSessionByToken(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  return prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function deleteSessionByToken(token) {
  if (!token) {
    return;
  }

  const tokenHash = hashSessionToken(token);

  await prisma.session.deleteMany({
    where: {
      tokenHash,
    },
  });
}