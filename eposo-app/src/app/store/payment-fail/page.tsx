import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
      <div>
        <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          결제에 실패했습니다.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          결제 처리 중 문제가 발생했습니다. 다시 시도하시거나 고객센터에 문의해주세요.
        </p>
        <div className="mt-8">
          <Link
            href="/store"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    </div>
  );
} 