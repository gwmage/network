import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, nickname, interests, preferredRegion } = body;

    if (!email || !name || !password || !nickname) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    const existingUser = await db.user.findFirst({
        where: { OR: [{ email }, { nickname }] }
    });

    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'nickname';
        return new NextResponse(`User with this ${field} already exists.`, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        nickname,
        interests,
        preferredRegion
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 