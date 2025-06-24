"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the user prop
type UserProfile = {
  name: string | null;
  nickname: string | null;
  email: string | null;
  interests: string | null;
  preferredRegion: string | null;
};

export default function EditProfileForm({ user }: { user: UserProfile }) {
  const [formData, setFormData] = useState({
    nickname: user.nickname || "",
    interests: user.interests || "",
    preferredRegion: user.preferredRegion || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update profile");
      }
      
      setSuccess("프로필이 성공적으로 업데이트되었습니다.");
      router.refresh(); // Re-fetch server-side props to show updated data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-500">이름</label>
        <p className="mt-1 text-lg text-gray-800">{user.name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500">이메일</label>
        <p className="mt-1 text-lg text-gray-800">{user.email}</p>
      </div>
      
      <hr className="my-6" />

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
        <input type="text" name="nickname" id="nickname" required value={formData.nickname} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">관심사 (쉼표로 구분)</label>
        <input type="text" name="interests" id="interests" value={formData.interests} placeholder="예: 코딩, 운동, 독서" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="preferredRegion" className="block text-sm font-medium text-gray-700">선호 지역</label>
        <input type="text" name="preferredRegion" id="preferredRegion" value={formData.preferredRegion} placeholder="예: 서울 강남" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          {isLoading ? "저장 중..." : "정보 수정"}
        </button>
      </div>
    </form>
  );
} 