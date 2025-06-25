import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.tickets < 1) {
      return NextResponse.json(
        { error: "매칭 이용권이 부족합니다. 스토어에서 이용권을 구매해주세요." },
        { status: 403 }
      );
    }
    
    const { region, wants, desiredConnections } = await req.json();

    if (!region || !wants || !desiredConnections) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingRequest = await db.matchingRequest.findFirst({
      where: { userId, status: "PENDING" },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "이미 진행 중인 매칭 요청이 있습니다." },
        { status: 409 }
      );
    }

    // 트랜잭션 시작: 이용권 차감과 매칭 요청 생성을 동시에 처리
    const matchingRequest = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. 이용권 1개 차감
      await tx.user.update({
        where: { id: userId },
        data: { tickets: { decrement: 1 } },
      });

      // 2. 매칭 요청 생성
      const newRequest = await tx.matchingRequest.create({
        data: {
          userId: userId,
          region,
          wants,
          desiredConnections,
          status: "PENDING",
        },
      });

      return newRequest;
    });

    return NextResponse.json(matchingRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating matching request:", error);
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