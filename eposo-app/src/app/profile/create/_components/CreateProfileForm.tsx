"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    interests: "",
    preferredRegion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to register");
      }
      
      // On successful registration, redirect to login page
      alert("회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/api/auth/signin"); // NextAuth default signin page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
          <input type="text" name="nickname" id="nickname" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input type="password" name="password" id="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
      </div>
       <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">관심사 (쉼표로 구분)</label>
          <input type="text" name="interests" id="interests" placeholder="예: 코딩, 운동, 독서" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="preferredRegion" className="block text-sm font-medium text-gray-700">선호 지역</label>
          <input type="text" name="preferredRegion" id="preferredRegion" placeholder="예: 서울 강남" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
        </div>
      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          {isLoading ? "가입하는 중..." : "회원가입"}
        </button>
      </div>
    </form>
  );
} 