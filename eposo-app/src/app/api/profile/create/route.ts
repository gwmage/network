import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check for existing user with the same email or nickname
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: data.email }, { nickname: data.nickname }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === data.email ? "Email" : "Nickname";
      return NextResponse.json(
        { error: `${field} already in use.` },
        { status: 409 }
      );
    }

    const newUser = await db.user.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 