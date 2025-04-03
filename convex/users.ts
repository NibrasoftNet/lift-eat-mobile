import { v } from 'convex/values';
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from './_generated/server';
import { Id } from './_generated/dataModel';

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
      username: args.username,
    });
    return userId;
  },
});
