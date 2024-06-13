import { initEdgeStore } from "@edgestore/server";
import {
    CreateContextOptions,
    createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
    // userId: string;
    userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
    // get current user info
    // we can use middleware here for now
    return {
        userRole: "admin", // hardcoded for now
    };
}

/**
 * This is the main router for the Edge Store buckets.
 */
const es = initEdgeStore.context<Context>().create();
// const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
    softhubProductImages: es
        .imageBucket({
            maxSize: 1024 * 1024 * 10,
        })
        .input(
            z.object({
                type: z.enum(["cover", "other"]),
            })
        )
        // ex: post type will be posted with /post/...xyz.jpg
        .path(({ input }) => [{ type: input.type }])
        .beforeDelete(({ ctx, fileInfo }) => {
            console.log("beforeDeleteImage: ", ctx, fileInfo);
            return true; // allow delete
        }),
    softhubProductFiles: es
        .fileBucket()
        // .path(({ctx}) => [{owner: ctx.userId}]),
        .accessControl({
            OR: [
                {
                    userRole: "admin",
                },
            ],
        })
        .beforeDelete(({ ctx, fileInfo }) => {
            console.log("beforeDeleteFile: ", ctx, fileInfo);
            return true; // allow delete
        }),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
