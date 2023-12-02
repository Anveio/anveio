import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { z } from "zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserForSessionToken } from "@/lib/auth/sign-in";

const AWS_BUCKET_NAME = z
  .string({
    required_error: "AWS_BUCKET_NAME not provided",
  })
  .parse(process.env.AWS_BUCKET_NAME);

export async function POST(request: Request) {
  const cookieStore = cookies();

  const sessionTokenCookie = cookieStore.get("sessionToken")?.value;

  if (!sessionTokenCookie) {
    return NextResponse.json({
      status: 400,
      error: "You must be logged in",
    });
  }

  const user = sessionTokenCookie
    ? await getUserForSessionToken(sessionTokenCookie)
    : undefined;

  if (!user) {
    return NextResponse.json({
      status: 400,
      error: "Invalid session token",
    });
  }

  const { filename, contentType } = await request.json();

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: AWS_BUCKET_NAME,
      Key: nanoid(),
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "private",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return NextResponse.json({ url, fields });
  } catch (error) {
    const { message } = error as Error;
    return NextResponse.json({ error: message });
  }
}
