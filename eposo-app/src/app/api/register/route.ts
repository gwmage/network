```typescript
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, nickname, contact, interests, preferredRegion } = body;

    // Input validation using regular expressions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; // Example: Minimum eight characters, at least one letter, one number and one special character
    const nameRegex = /^[가-힣a-zA-Z]+$/;
    const contactRegex = /^\d{10,11}$/; // Example: 10-11 digits

    if (!email || !name || !password || !nickname || !contact) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }
    if (!passwordRegex.test(password)) {
      return new NextResponse("Invalid password format", { status: 400 });
    }
    if (!nameRegex.test(name)) {
      return new NextResponse("Invalid name format", { status: 400 });
    }
    if (!contactRegex.test(contact)) {
      return new NextResponse("Invalid contact format", { status: 400 });
    }


    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "nickname";
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
        preferredRegion,
      },
    });

    // Redirect to login page after successful registration
    redirect("/login");

  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```