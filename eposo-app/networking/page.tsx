import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getNetworkingEvents() {
  const events = await prisma.networkingEvent.findMany({
    orderBy: {
      eventDate: "asc",
    },
  });
  return events;
}

export default async function NetworkingPage() {
  const events = await getNetworkingEvents();

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-12">
          <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              참여 가능한 네트워킹 모임
            </h1>
            <p className="text-xl text-gray-500">
              관심 있는 모임을 찾아보고 새로운 사람들과 교류해보세요.
            </p>
          </div>
          <ul
            role="list"
            className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
          >
            {events.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                현재 참여 가능한 모임이 없습니다. 곧 새로운 모임이 등록될 예정입니다!
              </p>
            ) : (
              events.map((event) => (
                <li key={event.id} className="p-6 bg-white rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.eventDate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">장소:</span> {event.location}
                    </div>
                     <div className="text-sm text-gray-700">
                      <span className="font-semibold">참가비:</span> {event.fee.toLocaleString()}원
                    </div>
                  </div>
                   <div className="mt-6">
                     <Link
                       href={`/networking/apply/${event.id}`}
                       className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                     >
                       참여 신청하기
                     </Link>
                   </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 