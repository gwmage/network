import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaymentButton from "./_components/PaymentButton";
import db from "@/lib/db";

export default async function StorePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/store");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const ticketPrice = 1000; // 이용권 1개당 1000원

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          매칭 이용권 스토어
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          새로운 네트워킹 기회를 놓치지 마세요.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">보유 이용권</h2>
          <span className="text-3xl font-bold text-indigo-600">{user?.tickets ?? 0}개</span>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">이용권 1개</h3>
              <p className="text-gray-500">AI 매칭 1회 사용 가능</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{ticketPrice.toLocaleString()}원</p>
          </div>
          <PaymentButton userId={session.user.id} amount={ticketPrice} />
        </div>
      </div>
    </div>
  );
} 