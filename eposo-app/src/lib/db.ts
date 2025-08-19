```typescript
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export async function createUser(data: {
  name: string;
  email: string;
  // Add other user properties as needed
}) {
  try {
    const user = await db.user.create({ data });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}
```