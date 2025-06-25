import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RequestForm from "./_components/RequestForm";

export default async function MatchingRequestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/matching/request");
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          매칭 요청하기
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500">
          원하는 네트워킹에 대한 정보를 알려주시면, 최적의 그룹을 찾아드릴게요.
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <RequestForm />
      </div>
    </div>
  );
} 