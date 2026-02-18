import { eq } from "drizzle-orm";
import { db } from "./lib/db";
import { feeds, users } from "./lib/db/schema";

export const handlerFeeds = async () => {
  const allFeeds = await db.select().from(feeds);

  if (allFeeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  for (const feed of allFeeds) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, feed.userId));

    console.log(`*${feed.name}`);
    console.log(`${feed.url}`);
    console.log(`${user?.name}`);
  }
};
