import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { CommandHandler } from "./loginCommand";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    try {
      const config = await readConfig();
      const currentUserName = config.currentUserName;

      if (!currentUserName) {
        throw new Error("You must be logged in to run this command.");
      }

      const user = await getUserByName(currentUserName);
      if (!user) {
        throw new Error(`User '${currentUserName}' not found.`);
      }

      return await handler(cmdName, user, ...args); 
    } catch (error) {
      console.error((error as Error).message);
    }
  };
}