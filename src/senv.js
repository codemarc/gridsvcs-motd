import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import packageJson from "../package.json" assert { type: "json" }
import logger from "./logger.js"

export default class senv {
  constructor(args, options) {

    try {
      // development mode
      this.nodeEnv = process.env.NODE_ENV ?? "development"

      // args and options
      this.args = args
      this.options = options

      // package.json
      this.name = packageJson.name
      this.version = packageJson.version
      this.description = packageJson.description

      // service base settings
      this.data = process.env.GS_DATA ?? "data"
      this.logs = process.env.GS_LOGS ?? "logs"
      this.port = process.env.GS_PORT ?? "3000"

      // openai
      this.openaiModel = process.env.GS_OPENAI_MODEL ?? "gpt-3.5-turbo"
      this.openaiApiKey = process.env.GS_OPENAI_API_KEY ?? ""

      // supabase
      this.supabaseProjectUrl = process.env.GS_SUPAURL ?? ""
      this.supabaseAnonKey = process.env.GS_SUPANON ?? ""
      this.supabaseServiceKey = process.env.GS_SUPASVC ?? ""

      // cache settings
      this.cacheTopicsTTL = process.env.GS_TOPICS_CACHE_TTL ?? "7200"
      this.cacheQuotesTTL = process.env.GS_QUOTES_CACHE_TTL ?? "86400"
      this.cacheQuotesMaxDays = process.env.GS_QUOTES_MAX_DAYS ?? "30"

      // calculate settings
      this.dataDir = path.join(process.cwd(), process.env.GS_DATA ?? "data")
      try {
        fs.ensureDir(this.dataDir)
      } catch (error) {
        logger.error(error.toString())
      }
      try {
        fs.readJSONSync("build.num")
      } catch (err) {
        fs.writeJSONSync("build.num", 0)
      }
      this.build = fs.readJSONSync("build.num")

    } catch (error) {
      logger.error(error.toString())
    }
  }

  setArgsOptions(args, options) {
    this.args = args
    this.options = options
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
      logger.info(`GS_DATA.....................[${chalk.green(this.data)}]`)
      logger.info(`GS_LOGS.....................[${chalk.green(this.logs)}]`)
      logger.info(`GS_PORT.....................[${chalk.green(this.port)}]`)

      logger.info(`GS_OPENAI_API_KEY...........[${checkKey(this.openaiApiKey)}]`)
      logger.info(`GS_OPENAI_MODEL.............[${chalk.green(this.openaiModel)}]`)

      logger.info(`GS_SUPAURL..................[${checkKey(this.supabaseProjectUrl, -1)}]`)
      logger.info(`GA_SUPANON..................[${checkKey(this.supabaseAnonKey)}]`)
      logger.info(`GA_SUPSVC...................[${checkKey(this.supabaseServiceKey)}]`)

      logger.info(`GS_TOPICS_CACHE_TTL.........[${chalk.green(this.cacheTopicsTTL)}]`)
      logger.info(`GS_QUOTES_CACHE_TTL.........[${chalk.green(this.cacheQuotesTTL)}]`)
      logger.info(`GS_QUOTES_MAX_DAYS..........[${chalk.green(this.cacheQuotesMaxDays)}]`)


      logger.info(chalk.blue(SEP))
      logger.info(`data directory resolves to ${chalk.bold(this.dataDir)}`)

    } catch (error) {
      logger.error(error.toString())
    }
  }
}
