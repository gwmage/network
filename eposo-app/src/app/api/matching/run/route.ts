import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { MatchingRequest, User } from "@prisma/client";

const MIN_GROUP_SIZE = 3;

export async function POST() {
  try {
    const pendingRequests = await db.matchingRequest.findMany({
      where: { status: "PENDING" },
      include: { user: true },
    });

    if (pendingRequests.length < MIN_GROUP_SIZE) {
      return NextResponse.json(
        {
          message: `매칭 대기중인 사용자가 ${MIN_GROUP_SIZE}명 미만입니다.`,
          count: pendingRequests.length,
        },
        { status: 200 }
      );
    }

    // Simple grouping logic by preferredRegion
    const groupsByRegion: Record<string, typeof pendingRequests> = {};

    for (const request of pendingRequests) {
      const region = request.user.preferredRegion;
      if (!groupsByRegion[region]) {
        groupsByRegion[region] = [];
      }
      groupsByRegion[region].push(request);
    }

    let groupsFormed = 0;
    const user_ids_to_update: string[] = [];

    for (const region in groupsByRegion) {
      const usersInRegion = groupsByRegion[region];
      if (usersInRegion.length >= MIN_GROUP_SIZE) {
        
        const newGroup = await db.matchedGroup.create({
            data: {
                members: {
                    connect: usersInRegion.map(
                        (req: MatchingRequest & { user: User }) => ({ id: req.userId })
                    )
                }
            }
        });
        
        groupsFormed++;
        user_ids_to_update.push(
            ...usersInRegion.map((req: MatchingRequest & { user: User }) => req.userId)
        );
      }
    }

    if (user_ids_to_update.length > 0) {
        await db.matchingRequest.updateMany({
            where: {
                userId: {
                    in: user_ids_to_update
                }
            },
            data: {
                status: 'MATCHED'
            }
        });
    }

    return NextResponse.json({
      message: `${groupsFormed}개의 그룹이 성공적으로 매칭되었습니다.`,
      matchedUserCount: user_ids_to_update.length
    });

  } catch (error) {
    console.error("Failed to run matching:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 