"use client";

import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";

export default function LoginSelector({ users }: { users: User[] }) {
  const router = useRouter();

  const handleLogin = (userId: string) => {
    // In a real app, this would involve a secure session.
    // For this demo, we'll use localStorage.
    localStorage.setItem("network-user-id", userId);
    alert(`${users.find(u => u.id === userId)?.name || '사용자'}님으로 로그인했습니다.`);
    router.push("/");
    router.refresh(); // This will help the header to re-render
  };

  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleLogin(user.id)}
            className="w-full text-left p-4 rounded-md bg-gray-50 hover:bg-indigo-100 border"
          >
            <p className="font-semibold text-gray-800">{user.name} ({user.nickname})</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </button>
        ))
      ) : (
        <p className="text-center text-gray-500">
          로그인할 사용자가 없습니다. 먼저 프로필을 생성해주세요.
        </p>
      )}
    </div>
  );
} 