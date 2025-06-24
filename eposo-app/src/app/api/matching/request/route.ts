import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다. 먼저 프로필을 생성해주세요." },
        { status: 401 }
      );
    }

    // Check for existing request
    const existingRequest = await db.matchingRequest.findUnique({
      where: { userId },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Matching request already exists." },
        { status: 409 }
      );
    }

    // Create new matching request
    const newRequest = await db.matchingRequest.create({
      data: {
        userId,
        status: "PENDING",
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Matching request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await db.matchingRequest.delete({
      where: { userId },
    });
    return NextResponse.json(
      { message: "Matching request cancelled successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to cancel matching request:", error);
    // Prisma throws P2025 if record to delete is not found
    if (error instanceof Error && (error as any).code === 'P2025') {
       return NextResponse.json(
        { error: "Matching request not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 