"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!confirm("정말로 매칭 신청을 취소하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/matching/request/${requestId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "취소 중 오류가 발생했습니다.");
      }

      alert("신청이 성공적으로 취소되었습니다.");
      router.refresh(); // Refresh the page to show the updated status
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCancel}
        disabled={isSubmitting}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? "취소하는 중..." : "신청 취소하기"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
} 