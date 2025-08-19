```typescript
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, nickname, contact, interests, preferredRegion } = body;

    // Input validation
    if (!email || !name || !password || !nickname || !contact) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return new NextResponse("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.", { status: 400 });
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
        contact,
        interests,
        preferredRegion
      },
    });

    return NextResponse.redirect(new URL("/login", request.url), { status: 302 });

  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```