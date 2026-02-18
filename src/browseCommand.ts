import { getPostsForUser } from "./registeryCommand";
import { UserCommandHandler } from "./middleware";

export const handlerBrowse: UserCommandHandler = async (
  cmdName,
  user,
  limitStr,
) => {
  const limit = limitStr ? parseInt(limitStr) : 2;

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found. Try adding and aggregating some feeds first!");
    return;
  }

  console.log(`--- Latest ${posts.length} posts for ${user.name} ---`);
  posts.forEach((post) => {
    console.log(`\n[${post.feedName}] - ${post.title}`);
    console.log(`Published: ${post.publishedAt?.toLocaleString()}`);
    console.log(`Link: ${post.url}`);
    console.log("-".repeat(30));
  });
};
