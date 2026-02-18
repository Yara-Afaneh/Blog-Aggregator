import { setUser } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("The login handler expects an argument (username).");
  }

  const username = args[0];

  const user = await getUserByName(username);

  if (!user) {
    throw new Error(`User with name '${username}' does not exist.`);
  }

  setUser(username);

  console.log(`User has been set to: ${username}`);
};
