import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/auth';

const f = createUploadthing();

// Copy from https://docs.uploadthing.com/getting-started/appdir#set-up-a-file-router
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
    },
  })
    .middleware(async ({}) => {
      const session = await auth();
      if (!session) throw new UploadThingError('Unauthorized');

      if (!session.user) throw new UploadThingError('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
