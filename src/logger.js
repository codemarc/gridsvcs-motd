import { format as formatDate } from "date-fns"
import path from "path"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import senv from "./senv.js"
const env = new senv()

const logger = winston.createLogger({
   level: "info",
   format: winston.format.combine(
      winston.format.timestamp({
         format: () =>
            formatDate(new Date(), "EEE yyyy-MM-dd hh:mm:ss a").toLowerCase(),
      }),
      winston.format.printf(({ timestamp, level, message }) => {
         return `${timestamp} [${level}]: ${message}`;
      })
   ),
   transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
         filename: path.join(env.logs, "motd-%DATE%.log"),
         datePattern: "YYYY-MM-DD",
         zippedArchive: true,
         maxSize: "20m",
         maxFiles: "14d",
      }),
   ],
});

export default logger;
