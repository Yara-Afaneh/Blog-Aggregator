import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

const CONFIG_FILE_NAME = ".gatorconfig.json";
function getConfigFilePath(): string {
  return path.join(os.homedir(), CONFIG_FILE_NAME);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url) {
    throw new Error("Config file is missing 'db_url'");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}
function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  const data = JSON.stringify(
    {
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    },
    null,
    2,
  );

  fs.writeFileSync(filePath, data);
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonContent = JSON.parse(rawData);
    return validateConfig(jsonContent);
  } catch (error) {
    throw new Error(`Could not read config file: ${error}`);
  }
}

export function setUser(userName: string): void {
  const currentConfig = readConfig();

  currentConfig.currentUserName = userName;

  writeConfig(currentConfig);
}
