"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "./_components/CreateProfileForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Network 서비스에 가입하여 새로운 만남을 시작하세요.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
} 