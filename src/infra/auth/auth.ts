import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../database/prisma.service';

export const auth = betterAuth({
  database: prismaAdapter(new PrismaService(), {
    provider: 'postgresql',
  }),
});
