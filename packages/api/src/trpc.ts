import { initTRPC } from '@trpc/server';
import { db } from '../../db/src/index';

// 1. Context
export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        db,
        ...opts,
    };
};

// 2. Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create();

// 3. Router & Procedure helpers
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;