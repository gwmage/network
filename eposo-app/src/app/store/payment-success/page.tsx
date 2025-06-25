import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
      <div>
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          결제가 성공적으로 완료되었습니다!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          매칭 이용권이 지급되었습니다. 지금 바로 새로운 네트워킹을 시작해보세요.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            href="/matching/request"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            매칭 신청하러 가기
          </Link>
          <Link
            href="/store"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 