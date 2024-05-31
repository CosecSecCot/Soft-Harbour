import { hash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export async function middleware(req: NextRequest) {
    if ((await isAuthenticted(req)) === false) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": "Basic",
            },
        });
    }
}

async function isAuthenticted(req: NextRequest) {
    const authHeader =
        req.headers.get("authorization") || req.headers.get("Authorization");

    if (authHeader == null) {
        return false;
    }

    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");

    return (
        username == process.env.ADMIN_USERNAME &&
        (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD))
    );
}

async function isValidPassword(
    password: string,
    hashedPassword: string | undefined
) {
    if (hashedPassword == undefined) {
        return false;
    }
    return (await hashPassword(password)) == hashedPassword;
}

async function hashPassword(password: string) {
    const arrayBuffer = await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(password)
    );

    return Buffer.from(arrayBuffer).toString("base64");
}

export const config = {
    matcher: "/admin/:path*",
};
