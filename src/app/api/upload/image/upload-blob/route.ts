import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const searchParamsSchema = z.object({
  filename: z.string(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filenameUnsafe = searchParams.get('filename');

  const fileNameParseResult = searchParamsSchema.safeParse({
    filename: filenameUnsafe,
  });

  if (!fileNameParseResult.success) {
    return NextResponse.json(
      {
        error: fileNameParseResult.error,
      },
      {
        status: 400,
      }
    );
  }

  if (!request.body) {
    return NextResponse.json(
      {
        error: 'No body',
      },
      {
        status: 400,
      }
    );
  }

  const fileName = fileNameParseResult.data.filename;

  const blob = await put(fileName, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
