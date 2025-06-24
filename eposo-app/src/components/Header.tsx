"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          network
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/matching/request"
            className="text-gray-600 hover:text-indigo-600"
          >
            매칭 요청하기
          </Link>
          <Link
            href="/matching/status"
            className="text-gray-600 hover:text-indigo-600"
          >
            매칭 현황보기
          </Link>

          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : session?.user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile/edit" className="text-gray-800 hover:text-indigo-600">
                환영합니다, {session.user.name || session.user.email}님!
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
               <button
                onClick={() => signIn()}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                로그인
              </button>
              <Link
                href="/profile/create"
                className="text-gray-600 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 