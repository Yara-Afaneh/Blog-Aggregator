import { deleteFeedFollow } from "./registeryCommand";
import { UserCommandHandler } from "./middleware";

export const handlerUnfollow: UserCommandHandler = async (cmdName, user, url) => {
  if (!url) {
    throw new Error("Usage: unfollow <feed_url>");
  }

  await deleteFeedFollow(user.id, url);
  console.log(`Unfollowed feed at ${url} for user ${user.name}`);
};