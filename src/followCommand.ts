
import { UserCommandHandler } from "./middleware";
import { getFeedByUrl, createFeedFollow } from "./registeryCommand";

export const handlerFollow: UserCommandHandler = async (cmdName, user, url) => {
  const feed = await getFeedByUrl(url);
  if (!feed) throw new Error("Feed not found");

  await createFeedFollow(feed.id, user.id);
  console.log(`* Feed: ${feed.name}`);
  console.log(`* User: ${user.name}`);
};
