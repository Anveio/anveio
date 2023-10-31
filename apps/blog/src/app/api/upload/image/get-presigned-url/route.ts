import { readStreamedRequestBody } from "@/lib/utils.edge.server";
import S3 from "aws-sdk/clients/s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ParamsSchema = z.object({
  key: z.string(),
  fileType: z.string(),
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await readStreamedRequestBody(req);

  const key = req.nextUrl.searchParams.get("key");
  const fileType = req.nextUrl.searchParams.get("fileType");

  const paramsResult = ParamsSchema.safeParse({ key, fileType });

  if (!paramsResult.success) {
    const missingParams = paramsResult.error.issues
      .filter(
        (issue) => issue.code === "invalid_type" && issue.received === "null"
      )
      .map((issue) => issue.path[0])
      .join(", ");

    return NextResponse.json({
      status: 400,
      statusText: {
        error: `Missing query params: ${missingParams}`,
      },
    });
  }

  const { key: validKey, fileType: validFileType } = paramsResult.data;

  const s3 = new S3({
    apiVersion: "2006-03-01",
  });

  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: validKey,
      "Content-Type": validFileType,
    },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
    ],
  });

  return NextResponse.json(post);
};

const validateRequiredParams = (params: {
  [key: string]: string | null;
}): string[] => {
  const missingParams: string[] = [];
  Object.keys(params).forEach((key) => {
    if (params[key] === null) {
      missingParams.push(key);
    }
  });
  return missingParams;
};
