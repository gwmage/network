"use client";

import Script from "next/script";
import { useState } from "react";

interface PaymentButtonProps {
  userId: string;
  amount: number;
}

declare global {
  interface Window {
    NICEPAY: any;
  }
}

export default function PaymentButton({ userId, amount }: PaymentButtonProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      alert("결제 모듈을 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      // 1. 서버에 결제 정보 보내고 주문 ID(orderId) 받아오기
      const response = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, ticketsPurchased: 1 }),
      });
      const { orderId } = await response.json();

      if (!response.ok) {
        throw new Error('결제 준비에 실패했습니다.');
      }
      
      // 2. 나이스페이 결제창 호출
      window.NICEPAY.pay({
        clientId: 'S2_f582f06121b641e7b95bb742f0685652', // 테스트 ClientKey
        moid: orderId,
        amount: amount,
        goodsName: '매칭 이용권 1개',
        buyerName: '구매자', // 실제로는 사용자 이름으로
        buyerEmail: 'test@example.com', // 실제로는 사용자 이메일로
        buyerTel: '010-0000-0000',
        returnUrl: `${window.location.origin}/api/payments/nicepay/return`,
        errorUrl: `${window.location.origin}/api/payments/nicepay/return`, // 에러 발생 시에도 동일한 URL로
        authSuccessUrl: `${window.location.origin}/store/payment-success`,
        authFailUrl: `${window.location.origin}/store/payment-fail`,
      });

    } catch (error) {
      console.error("Payment failed:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Script
        src="https://pay.nicepay.co.kr/v1/js/"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={!isScriptLoaded}
        className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isScriptLoaded ? `${amount.toLocaleString()}원 결제하기` : "결제 모듈 로딩 중..."}
      </button>
    </>
  );
} 