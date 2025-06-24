import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { nickname, interests, preferredRegion } = body;

    if (!nickname) {
        return new NextResponse("Nickname is required", { status: 400 });
    }

    // Check if the new nickname is already taken by another user
    const existingUser = await db.user.findFirst({
        where: {
            nickname: nickname,
            id: { not: session.user.id }
        }
    });

    if (existingUser) {
        return new NextResponse("Nickname is already in use by another account.", { status: 409 });
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        nickname,
        interests,
        preferredRegion,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 