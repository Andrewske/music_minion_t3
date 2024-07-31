import { ConsoleLogWriter, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import { refreshAccessToken } from "./refreshAccessToken";

const checkAuth = async ({ userId }: { userId: string }) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  if (
    !userAccount?.access_token ||
    !userAccount?.refresh_token ||
    !userAccount.expires_at
  ) {
    throw new Error("Unauthorized");
  }

  let accessToken = userAccount.access_token;

  try {
    const now = new Date().getTime() / 1000;

    if (now > userAccount.expires_at) {
      const refreshedToken = await refreshAccessToken(
        userAccount.refresh_token,
      );
      accessToken = refreshedToken.access_token;

      const expiresAt =
        userAccount.expires_at + refreshedToken.expires_in * 1000;

      await db
        .update(accounts)
        .set({
          access_token: refreshedToken.access_token,
          expires_at: expiresAt,
        })
        .where(eq(accounts.userId, userId));
    }

    return accessToken;
  } catch (error) {
    throw error;
  }
};

export default checkAuth;
