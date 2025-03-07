import * as z from 'zod';

export const userProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profileImage: z.any().optional().nullable(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export type UserProfileDefaultValuesProps = {
  name: string;
  email: string;
  profileImage?: Buffer<ArrayBufferLike>;
};
