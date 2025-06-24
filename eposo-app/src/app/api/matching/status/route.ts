import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const matchingRequest = await db.matchingRequest.findUnique({
      where: { userId: userId },
    });

    if (!matchingRequest) {
      return NextResponse.json({ status: "NOT_REQUESTED" });
    }
    
    if (matchingRequest.status === 'MATCHED') {
        const group = await db.matchedGroup.findFirst({
            where: {
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        nickname: true,
                        interests: true
                    }
                }
            }
        });
        return NextResponse.json({ status: 'MATCHED', group });
    }

    return NextResponse.json({ status: matchingRequest.status }); // PENDING
  } catch (error) {
    console.error("Failed to get matching status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 