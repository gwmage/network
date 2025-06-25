import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { ClockIcon, TicketIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/24/outline";

async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      payments: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      },
      matchingRequest: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return user;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  const userProfile = await getUserProfile(session.user.id);

  if (!userProfile) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  const { name, nickname, email, tickets, payments, matchingRequest } = userProfile;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">마이페이지</h1>

        {/* 사용자 정보 및 이용권 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="h-8 w-8 mr-3 text-indigo-500" />
              내 정보
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>이름:</strong> {name}</p>
              <p><strong>닉네임:</strong> {nickname}</p>
              <p><strong>이메일:</strong> {email}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">보유 이용권</h3>
            <div className="flex items-center text-indigo-600">
              <TicketIcon className="h-10 w-10 mr-2" />
              <span className="text-5xl font-bold">{tickets}</span>
              <span className="text-xl ml-1">개</span>
            </div>
          </div>
        </div>

        {/* 이용 내역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 결제 내역 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon className="h-8 w-8 mr-3 text-green-500" />
              결제 내역
            </h2>
            <ul className="space-y-4">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <li key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-semibold">{p.ticketsPurchased}개 이용권 구매</p>
                      <p className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleString('ko-KR')}</p>
                    </div>
                    <span className="font-bold text-green-600">+{p.amount.toLocaleString()}원</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">결제 내역이 없습니다.</p>
              )}
            </ul>
          </div>

          {/* 티켓 사용 내역 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <ClockIcon className="h-8 w-8 mr-3 text-blue-500" />
              매칭 요청 내역
            </h2>
            <ul className="space-y-4">
              {matchingRequest.length > 0 ? (
                matchingRequest.map((req) => (
                  <li key={req.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-semibold">{req.region} 매칭 요청</p>
                      <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleString('ko-KR')}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      req.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 
                      req.status === 'MATCHED' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {req.status}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">매칭 요청 내역이 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 