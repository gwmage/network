import db from "@/lib/db";
import LoginSelector from "./_components/LoginSelector";

async function getUsers() {
  const users = await db.user.findMany();
  return users;
}

export default async function LoginPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            사용자로 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            테스트를 위해 로그인할 사용자를 선택해주세요.
          </p>
        </div>
        <LoginSelector users={users} />
      </div>
    </div>
  );
} 