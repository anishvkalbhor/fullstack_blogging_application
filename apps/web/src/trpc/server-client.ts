import { appRouter } from '../../../../packages/api/src/root';
import { createTRPCContext } from '../../../../packages/api/src/trpc';

const context = createTRPCContext({
    headers: new Headers(),
});

export const api = appRouter.createCaller(context);