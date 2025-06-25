"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestForm() {
  const [formData, setFormData] = useState({
    region: "",
    wants: "",
    desiredConnections: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/matching/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request");
      }
      
      alert("매칭 요청이 성공적으로 접수되었습니다.");
      router.push("/matching/status");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400";
  const labelStyle = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      
      <div>
        <label htmlFor="region" className={labelStyle}>네트워킹 희망 지역</label>
        <input type="text" name="region" id="region" required className={inputStyle} placeholder="예: 서울 강남, 온라인" onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="wants" className={labelStyle}>이번 네트워킹에서 원하는 것은 무엇인가요?</label>
        <textarea name="wants" id="wants" required rows={4} className={inputStyle} placeholder="예: 새로운 사이드 프로젝트 팀원 찾기, 최신 기술 트렌드 공유" onChange={handleChange}></textarea>
      </div>

      <div>
        <label htmlFor="desiredConnections" className={labelStyle}>어떤 사람들을 만나고 싶나요?</label>
        <textarea name="desiredConnections" id="desiredConnections" required rows={4} className={inputStyle} placeholder="예: 5년차 이상의 프론트엔드 개발자, UI/UX 디자이너" onChange={handleChange}></textarea>
      </div>
      
      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          {isLoading ? "요청하는 중..." : "매칭 요청하기"}
        </button>
      </div>
    </form>
  );
} 