import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID는 필수입니다." },
        { status: 400 }
      );
    }
    
    const updatedRequest = await prisma.matchingRequest.update({
      where: { id: requestId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error cancelling request:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 