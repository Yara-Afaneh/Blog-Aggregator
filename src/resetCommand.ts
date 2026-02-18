import { deleteUsers } from "./registeryCommand";


export const handlerReset = async () => {
  try {
    await deleteUsers();
    console.log("Database reset successfully: All users deleted.");
  } catch (err) {
    throw new Error(`Could not reset database: ${err}`);
  }
};