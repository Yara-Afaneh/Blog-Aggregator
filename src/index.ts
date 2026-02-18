import { handlerAddFeed } from "./addfeedommand";
import { handlerAgg } from "./aggCommand";
import { handlerBrowse } from "./browseCommand";
import { readConfig } from "./config";
import { handlerFollow } from "./followCommand";
import { handlerFollowing } from "./followingHandler";
import { handlerFeeds } from "./getfeedsCommand";
import { handlerUsers } from "./getUserscommand";

import { handlerLogin } from "./loginCommand";
import { middlewareLoggedIn } from "./middleware";
import { handlerRegister } from "./registerHandler";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./registeryCommand";
import { handlerReset } from "./resetCommand";
import { handlerUnfollow } from "./unfollow";
async function main() {
  const registry: CommandsRegistry = {};
  const config = await readConfig();

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", async (cmdName, ...args) => {
    await handlerUsers(config);
  });

  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "feeds", async () => {
    await handlerFeeds();
  });
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Error: Not enough arguments provided.");
    console.log("Usage: npm start <command> <args>");
    process.exit(1);
  }
  const commandName = args[0];
  const commandArgs = args.slice(1);

  try {
    await runCommand(registry, commandName, ...commandArgs);
    process.exit(0);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();
