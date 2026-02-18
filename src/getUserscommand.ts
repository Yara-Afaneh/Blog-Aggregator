import { getUsers } from "./registeryCommand";

export const handlerUsers = async (config: any) => {
  const allUsers = await getUsers();
  const currentUser = config.currentUserName;

  console.log("Current user from config:", currentUser);

  allUsers.forEach((user) => {
    if (user.name === currentUser) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  });
};
