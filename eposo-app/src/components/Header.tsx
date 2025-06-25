"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Popover } from "@headlessui/react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const navLinkClasses = "text-gray-600 hover:text-indigo-600";
  const mobileNavLinkClasses = "text-gray-600 hover:text-indigo-600";

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          network
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/matching/request"
            className={navLinkClasses}
          >
            매칭 요청하기
          </Link>
          <Link
            href="/matching/status"
            className={navLinkClasses}
          >
            매칭 현황보기
          </Link>
          <Link
            href="/store"
            className={navLinkClasses}
          >
            스토어
          </Link>

          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : session?.user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className={navLinkClasses}>
                마이페이지
              </Link>
              <button
                onClick={() => signOut()}
                className={navLinkClasses}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/api/auth/signin"
                className={navLinkClasses}
              >
                로그인
              </Link>
              <Link
                href="/profile/create"
                className={navLinkClasses}
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Popover className="relative">
        <Popover.Button className="flex items-center justify-center">
          {/* Mobile menu button */}
        </Popover.Button>

        <Popover.Panel className="absolute z-10">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {session ? (
                <>
                  <div className="flex-shrink-0">
                    {/* You can add user image here */}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="mt-3 px-2 space-y-1">
              {session ? (
                <>
                  <Link href="/profile" className={mobileNavLinkClasses}>
                    마이페이지
                  </Link>
                  <button onClick={() => signOut()} className={mobileNavLinkClasses}>
                    로그아웃
                  </button>
                </>
              ) : (
                <Link href="/api/auth/signin" className={mobileNavLinkClasses}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </header>
  );
} 