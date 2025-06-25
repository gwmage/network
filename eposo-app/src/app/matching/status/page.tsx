import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import CancelButton from "./_components/CancelButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function getMatchingStatus(userId: string) {
  const matchedInfo = await prisma.groupParticipant.findFirst({
    where: {
      userId: userId,
    },
    include: {
      group: {
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      group: {
        createdAt: 'desc',
      }
    }
  });
  
  const request = await prisma.matchingRequest.findUnique({
    where: { userId }
  });

  return { request, matchedGroup: matchedInfo?.group };
}

export default async function MatchingStatusPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로그인이 필요합니다.</h1>
          <p className="mt-4">
            <Link href="/api/auth/signin" className="text-indigo-600 hover:underline">
              로그인 페이지로 이동
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const { request: matchingRequest, matchedGroup } = await getMatchingStatus(session.user.id);
  
  if (!matchingRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">매칭을 시작해보세요!</h2>
          <p className="text-gray-600 mb-8">아직 신청한 매칭이 없어요. 지금 바로 AI에게 네트워킹 그룹을 찾아달라고 요청하세요.</p>
          <Link href="/matching/request" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
            매칭 신청하기
          </Link>
        </div>
      </div>
    )
  }

  if (matchingRequest.status === 'PENDING') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
            <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-6 text-2xl font-bold text-gray-800">AI가 최적의 그룹을 찾고 있습니다...</h2>
                <p className="mt-2 text-gray-600">신청내용: {matchingRequest.region} | 접수일: {new Date(matchingRequest.createdAt).toLocaleDateString('ko-KR')}</p>
                <div className="mt-8">
                    <CancelButton requestId={matchingRequest.id} />
                </div>
            </div>
        </div>
      )
  }

  if (matchingRequest.status === 'MATCHED') {
      if (!matchedGroup) {
          return <div className="text-center p-8">매칭된 그룹 정보를 불러오는 데 실패했습니다.</div>
      }

      return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8">
                <p className="font-bold">매칭 성공!</p>
                <p>최적의 네트워킹 그룹을 찾았습니다. 아래에서 약속 정보를 확인하세요.</p>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {matchedGroup.location}에서 만나는 네트워킹
              </h2>
              <p className="text-indigo-600 font-semibold mb-6">
                약속 시간: {new Date(matchedGroup.eventDate).toLocaleString('ko-KR', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">함께하는 멤버</h3>
              <ul className="space-y-4">
                {matchedGroup.participants.map((participant: any) => (
                  <li key={participant.userId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0">
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{participant.user.name} ({participant.user.nickname})</p>
                      <p className="text-sm text-gray-600">{participant.user.jobTitle} @ {participant.user.jobField}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
  }

  return <div className="text-center p-8">알 수 없는 매칭 상태입니다.</div>;
} 