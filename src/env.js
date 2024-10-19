import path from "path"
import logger from "./logger.js"
import chalk from "chalk"
import { el } from 'date-fns/locale'

export default class env {
  constructor() {
    this.init()
  }

  async init() {
    try {
      this.vars = {
        GS_OPENAI_MODEL: process.env.GS_OPENAI_MODEL ?? "gpt-3.5-turbo",
        GS_OPENAI_API_KEY: process.env.GS_OPENAI_API_KEY ?? "",

        GS_SUPAURL: process.env.GS_SUPAURL ?? "",
        GS_SUPANON: process.env.GS_SUPANON ?? "",
        GS_SUPASVC: process.env.GS_SUPASVC ?? "",

        GS_TOPICS_CACHE_TTL: process.env.GS_TOPICS_CACHE_TTL ?? "7200",
        GS_QUOTES_CACHE_TTL: process.env.GS_QUOTES_CACHE_TTL ?? "86400",
        GS_QUOTES_MAX_DAYS: process.env.GS_QUOTES_MAX_DAYS ?? "30",

        GS_DATA: process.env.GS_DATA ?? "data",
        GS_LOGS: process.env.GS_LOGS ?? "logs",
        GS_PORT: process.env.GS_PORT ?? "3000"
      }
      this.dataDir = path.join(process.cwd(), process.env.GS_DATA ?? "data")
      this.nodeEnv = process.env.NODE_ENV ?? "development"
    } catch (error) {
      logger.error(error.toString())
    }
  }

  async display() {
    const SEP = "=".repeat(77)

    const notSet = () => { return chalk.red("not set") }

    const checkKey = (v, n = 4) => {
      if (v === undefined || v == 0) return notSet()
      else if (n === -1) return chalk.green(v)
      else {
        return chalk.green(v.substring(0, n))
          + chalk.red("•".repeat(32))
          + chalk.green(v.substring(v.length - n))
      }
    }

    try {
      logger.info(chalk.blue(SEP))
      logger.info(`NODE_ENV....................[${chalk.green(this.nodeEnv)}]`)
      logger.info(`GS_DATA.....................[${chalk.green(this.vars.GS_DATA)}]`)
      logger.info(`GS_LOGS.....................[${chalk.green(this.vars.GS_LOGS)}]`)
      logger.info(`GS_PORT.....................[${chalk.green(this.vars.GS_PORT)}]`)

      logger.info(`GS_TOPICS_CACHE_TTL.........[${chalk.green(this.vars.GS_TOPICS_CACHE_TTL)}]`)
      logger.info(`GS_QUOTES_CACHE_TTL.........[${chalk.green(this.vars.GS_QUOTES_CACHE_TTL)}]`)
      logger.info(`GS_QUOTES_MAX_DAYS..........[${chalk.green(this.vars.GS_QUOTES_MAX_DAYS)}]`)

      logger.info(`GS_SUPAURL..................[${checkKey(this.vars.GS_SUPAURL, -1)}]`)
      logger.info(`GA_SUPANON..................[${checkKey(this.vars.GS_SUPANON)}]`)
      logger.info(`GA_SUPSVC...................[${checkKey(this.vars.GS_SUPASVC)}]`)

      logger.info(`GS_OPENAI_API_KEY...........[${checkKey(this.vars.GS_OPENAI_API_KEY)}]`)
      logger.info(`GS_OPENAI_MODEL.............[${chalk.green(this.vars.GS_OPENAI_MODEL)}]`)

      logger.info(chalk.blue(SEP))
      logger.info(`data directory resolves to ${chalk.bold(this.dataDir)}`)

    } catch (error) {
      logger.error(error.toString())
    }
  }
}
