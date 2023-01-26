import * as dotenv from "dotenv";
dotenv.config();

const environment = process.env.ENVIRONMENT;

export const devlog = (log) => {
  if(environment === "dev") {
    console.log(log);
  }
}