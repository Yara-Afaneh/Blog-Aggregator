import { CommandHandler } from "./loginCommand";
import { createUser, getUserByName } from "./lib/db/queries/users";
import { setUser } from "./config";

export const handlerRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Usage: register <username>");
  }

  const username = args[0];

  const existingUser = await getUserByName(username);
  if (existingUser) {
    throw new Error("User already exists!");
  }

  const newUser = await createUser(username);
  setUser(newUser.name);

  console.log(`User created successfully: ${newUser.name}`);
  console.log(newUser);
};
