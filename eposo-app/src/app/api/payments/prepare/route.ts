import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, ticketsPurchased } = await req.json();

    if (!amount || !ticketsPurchased) {
      return NextResponse.json(
        { error: "Amount and ticketsPurchased are required" },
        { status: 400 }
      );
    }
    
    // 고유한 주문 ID 생성 (예: 'userid_timestamp')
    const orderId = `${session.user.id}_${new Date().getTime()}`;

    // Payment 테이블에 PENDING 상태로 미리 저장
    await db.payment.create({
      data: {
        userId: session.user.id,
        amount,
        ticketsPurchased,
        status: "PENDING",
        orderId,
        paymentGateway: 'NICEPAY', // 나중에 다른 PG사 추가될 수 있음
      },
    });

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Error preparing payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 