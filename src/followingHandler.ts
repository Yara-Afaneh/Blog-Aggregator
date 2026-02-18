import { Config } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { UserCommandHandler } from "./middleware";
import { getFeedFollowsForUser } from "./registeryCommand";

export const handlerFollowing: UserCommandHandler = async (cmdName, user) => {
  const follows = await getFeedFollowsForUser(user.id);
  if (follows.length === 0) {
    console.log(`${user.name} is not following any feeds yet.`);
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);
  follows.forEach((f) => {
    console.log(`* ${f.feedName}`);
  });
};
