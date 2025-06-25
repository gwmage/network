import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/lib/db";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

async function validateAndCompletePayment(
  tid: string,
  orderId: string,
  amount: string
) {
  // 나이스페이 서버와 통신하여 최종 승인을 요청하는 로직
  // 주의: 실제 운영 시에는 MID와 MerchantKey를 환경변수로 관리해야 합니다.
  const merchantKey = "your_nicepay_merchant_key"; // 실제 나이스페이 가맹점 키로 교체 필요
  const mid = "your_nicepay_mid"; // 실제 나이스페이 MID로 교체 필요

  const ediDate = new Date().toISOString().slice(0, 19).replace(/[^0-9]/g, "");
  
  // 승인 요청용 암호화 데이터 생성 (SHA-256)
  const signData = crypto
    .createHash("sha256")
    .update(tid + mid + amount + merchantKey)
    .digest("hex");

  const url = "https://web.nicepay.co.kr/v1/payment"; // 실제 승인 URL
  const params = new URLSearchParams({
      TID: tid,
      MID: mid,
      Moid: orderId,
      Amt: amount,
      EdiDate: ediDate,
      SignData: signData,
      CharSet: 'utf-8'
  });

  try {
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });
    const result = await response.json();

    if (result.ResultCode === "3001") { // 성공 코드
      return { success: true, data: result };
    } else {
      return { success: false, message: result.ResultMsg };
    }
  } catch (error) {
    console.error("Nicepay approval error:", error);
    return { success: false, message: "PG사 승인 요청 중 오류가 발생했습니다." };
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tid = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const resultCode = searchParams.get("resultCode");

  if (resultCode !== '0000') { // 결제창 단계에서 실패/취소
    await db.payment.update({
        where: { orderId: orderId! },
        data: { status: 'FAILED', transactionId: tid },
    });
    return NextResponse.redirect(new URL("/store/payment-fail", req.url));
  }

  if (!tid || !orderId || !amount) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  // const validation = await validateAndCompletePayment(tid, orderId, amount);
  // 현재는 PG사 연동을 가정하고 무조건 성공으로 처리. 실제 연동 시 위 주석을 해제해야 함.
  const validation = { success: true }; 

  if (validation.success) {
    const payment = await db.payment.findUnique({ where: { orderId } });
    if (payment && payment.status === 'PENDING') {
      await db.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.payment.update({
          where: { orderId },
          data: { status: "COMPLETED", transactionId: tid },
        });
        await tx.user.update({
          where: { id: payment.userId },
          data: { tickets: { increment: payment.ticketsPurchased } },
        });
      });
      return NextResponse.redirect(new URL("/store/payment-success", req.url));
    }
  } else {
    await db.payment.update({
      where: { orderId },
      data: { status: "FAILED", transactionId: tid },
    });
    return NextResponse.redirect(new URL("/store/payment-fail", req.url));
  }
  
  // 이미 처리된 요청이거나 잘못된 접근
  return NextResponse.redirect(new URL("/", req.url));
} 