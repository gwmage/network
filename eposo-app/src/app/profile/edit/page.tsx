import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import EditProfileForm from "./_components/EditProfileForm";

async function getUserData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      nickname: true,
      email: true,
      interests: true,
      preferredRegion: true,
    }
  });
  return user;
}

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await getUserData(session.user.id);

  if (!user) {
    // This case should ideally not happen if a session exists.
    // Could be a database inconsistency.
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">회원 정보 수정</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <EditProfileForm user={user} />
      </div>
    </div>
  );
} 