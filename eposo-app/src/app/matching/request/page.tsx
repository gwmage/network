"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestMatchingPage() {
  const router = useRouter();
  const [preferredLocation, setPreferredLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/matching/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredLocation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "매칭 요청 중 오류가 발생했습니다.");
      }

      alert("매칭 요청이 성공적으로 접수되었습니다! 매칭이 완료되면 알려드릴게요.");
      router.push("/matching/status"); // Redirect to the status page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            네트워킹 매칭 신청
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            원하는 네트워킹 조건을 알려주시면, AI가 최적의 그룹을 찾아드릴게요.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="preferredLocation" className="sr-only">
                선호 지역
              </label>
              <input
                id="preferredLocation"
                name="preferredLocation"
                type="text"
                required
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="선호하는 네트워킹 지역 (예: 강남, 홍대, 온라인)"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "신청하는 중..." : "AI 매칭 신청하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 