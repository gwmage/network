import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      nickname,
      jobField,
      jobTitle,
      interests,
      profilePictureUrl,
    } = body;

    if (!email || !name || !nickname || !jobField || !jobTitle) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        nickname,
        jobField,
        jobTitle,
        interests,
        profilePictureUrl,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    // Check for unique constraint violation
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json(
            { error: "이미 사용중인 이메일입니다." },
            { status: 409 }
        );
    }
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 