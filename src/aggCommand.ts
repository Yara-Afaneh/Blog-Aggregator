import { fetchFeed } from "./fetchfeed";
import {
  createPost,
  getNextFeedToFetch,
  markFeedFetched,
} from "./registeryCommand";
import { CommandHandler } from "./loginCommand";
async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) return;

  await markFeedFetched(feed.id);

  try {
    const fetchedData = await fetchFeed(feed.url);

    for (const item of fetchedData.items) {
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

      await createPost({
        title: item.title ?? "Untitled",
        url: item.link ?? "",
        description: item.contentSnippet ?? item.content ?? null,
        publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        feedId: feed.id,
      });
    }
    console.log(
      `Successfully synced ${fetchedData.items.length} posts from ${feed.name}`,
    );
  } catch (err) {
    console.error(`Scraping error: ${(err as Error).message}`);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) throw new Error(`Invalid duration: ${durationStr}`);

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return 0;
  }
}

export const handlerAgg: CommandHandler = async (cmdName, timeBetweenReqs) => {
  if (!timeBetweenReqs) {
    throw new Error("Usage: agg <time_between_reqs> (e.g. 1m, 10s)");
  }

  const timeBetweenRequests = parseDuration(timeBetweenReqs);
  console.log(`Collecting feeds every ${timeBetweenReqs}...`);

  await scrapeFeeds();

  const interval = setInterval(async () => {
    await scrapeFeeds();
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\nShutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};
