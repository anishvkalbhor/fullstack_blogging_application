import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from 'api/root';

// Create the tRPC + React Query client
export const trpc = createTRPCReact<AppRouter>({});