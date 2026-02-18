import { and, eq, sql } from "drizzle-orm";
import { db } from "./lib/db";
import { feed_follows, feeds, posts, users } from "./lib/db/schema";
import { CommandHandler } from "./loginCommand";

export type CommandsRegistry = {
  [key: string]: CommandHandler;
};
export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function deleteUsers() {
  return await db.delete(users);
}

export async function getUsers() {
  return await db.select().from(users);
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}
export async function createFeed(name: string, url: string, userId: string) {
  const [newFeed] = await db
    .insert(feeds)
    .values({
      name: name,
      url: url,
      userId: userId,
    })
    .returning();

  return newFeed;
}
export function printFeed(feed: Feed, user: User) {
  console.log(`* Name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
  console.log(`* Created At:    ${feed.createdAt}`);
  console.log(`* Updated At:    ${feed.updatedAt}`);
  console.log(`* ID:            ${feed.id}`);
  console.log(`* User ID:       ${feed.userId}`);
}

export async function createFeedFollow(feeds_id: string, user_id: string) {
  await db
    .insert(feed_follows)
    .values({
      user_id: user_id,
      feeds_id: feeds_id,
    })
    .onConflictDoNothing(); 
  const result = await db
    .select({
      id: feed_follows.id,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feeds_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(
      and(
        eq(feed_follows.user_id, user_id),
        eq(feed_follows.feeds_id, feeds_id),
      ),
    );

  return result[0];
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function getFeedFollowsForUser(userId: string) {
  return await db
    .select({
      id: feed_follows.id,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feeds_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.user_id, userId));
}
export async function deleteFeedFollow(userId: string, url: string) {
  await db
    .delete(feed_follows)
    .where(
      and(
        eq(feed_follows.user_id, userId),
        eq(
          feed_follows.feeds_id,
          db.select({ id: feeds.id }).from(feeds).where(eq(feeds.url, url))
        )
      )
    );
}

export async function markFeedFetched(feedId: string) {
  await db.update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [nextFeed] = await db.select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);
  return nextFeed;
}

export async function createPost(post: {
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  feedId: string;
}) {
  const [newPost] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      description: post.description,
      publishedAt: post.publishedAt,
      feedId: post.feedId,
    })
    .onConflictDoNothing() 
    .returning();
  
  return newPost;
}

export async function getPostsForUser(userId: string, limit: number = 10) {
  return await db
    .select({
      title: posts.title,
      url: posts.url,
      publishedAt: posts.publishedAt,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feed_follows, eq(feeds.id, feed_follows.feeds_id))
    .where(eq(feed_follows.user_id, userId))
    .orderBy(desc(posts.publishedAt)) 
    .limit(limit);
}




export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (handler) {
    await handler(cmdName, ...args);
  } else {
    throw new Error(`Command '${cmdName}' not found`);
  }
}
