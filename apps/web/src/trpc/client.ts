import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../../../packages/api/src/root';

// Create the tRPC + React Query client
export const trpc = createTRPCReact<AppRouter>({});