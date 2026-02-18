import { UserCommandHandler } from "./middleware";
import { createFeed, createFeedFollow } from "./registeryCommand";

export const handlerAddFeed: UserCommandHandler = async (
  cmdName,
  user,
  name,
  url,
) => {
  const newFeed = await createFeed(name, url, user.id);
  await createFeedFollow(newFeed.id, user.id);

  console.log(`Feed added: ${newFeed.name}`);
  console.log(`User: ${user.name}`);
};
