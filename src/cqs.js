import OpenAI from "openai"
import fs from "fs-extra"
import path from "path"
import logger from "./logger.js"
import { createClient } from "@supabase/supabase-js"
import _ from "lodash"

const DATA_DIR = path.join(process.cwd(), process.env.GS_DATA ?? "data")
const TOPICS_FILE = DATA_DIR + "/topics.json"
const supabaseUrl = process.env.GS_SUPAURL ?? ""
const supabaseRdKey = process.env.GS_SUPAPUBLIC ?? ""
const supabaseUpKey = process.env.GS_SUPAUPDATE ?? ""

export default class cqs {

   async refreshQuotes(options = { force: false, database: false }, topic = "general") {
      const { force, database } = options
      const quotesFile = DATA_DIR + `/${topic}.quotes.json`
      const dataFile = DATA_DIR + `/${topic}.data.json`

      try {
         if (force || database || !fs.existsSync(quotesFile)) {
            await this.fetchNewQuotes(options, topic)

         } else {
            const fileStats = await fs.stat(quotesFile)

            // Default TTL is 1 day (86400 seconds)
            const ttl = parseInt(process.env.GS_QUOTES_CACHE_TTL ?? '86400', 10)
            const fileAgeDays = Math.floor((Date.now() - fileStats.mtime.getTime()) / (1000 * ttl))

            // If the file is older than 30 days, fetch new quotes
            const maxdays = parseInt(process.env.GS_QUOTES_MAX_DAYS ?? '30', 10)
            logger.info(`quotes file age is ${fileAgeDays} days`)

            if (fileAgeDays > maxdays) {
               await this.fetchNewQuotes(topic)
            }
         }

         const json = fs.readJSONSync(quotesFile)
         const supabase = createClient(supabaseUrl, supabaseUpKey)
         try {
            if (database == false) {
               const model = json.model
               const usage = json.usage
               const quotes = json.hasOwnProperty('message') ? json.message : JSON.parse(json.choices[0].content)
               const { error } = await supabase.from('topics').update({ model: model, usage: usage, message: quotes }).eq('id', json.cid)
               if (error) throw error
               fs.writeJSONSync(dataFile, quotes, { spaces: 3 })
            }
            return 0
         } catch (err) {
            const model = json.model
            const usage = json.usage
            let messages = '' + json.choices[0].message.content
            const qlist = '[' + messages.split('[')[1].split(']')[0] + ']'
            const quotes = JSON.parse(qlist)
            const { error } = await supabase.from('topics').update({ model: model, usage: usage, message: quotes }).eq('id', json.cid)
            if (error) throw error
            fs.writeJSONSync(dataFile, quotes, { spaces: 3 })
            return 0
         }

      } catch (err) {
         console.error(err)
         return 1
      }
   }

   async fetchNewQuotes(options, topic) {

      const topics = fs.readJSONSync(TOPICS_FILE)
      const t2refresh = _.find(topics, (t) => { if (t.topic == topic) { return t } })

      if (!t2refresh) {
         logger.error(`topic ${topic} not found`)
         return
      }

      const { database } = options
      if (options.database) {
         const supabase = createClient(supabaseUrl, supabaseRdKey)

         const { data, error } = await supabase
            .from('topics').select('*').eq('topic', topic)

         if (error) {
            logger.error("Error fetching quotes from database:", error)
            throw error
         }

         const quotesFile = DATA_DIR + `/${topic}.quotes.json`
         fs.writeJSONSync(quotesFile, data[0], { spaces: 3 })
         logger.info(`Quotes file rebuilt from database for topic ${topic}`)
         return;

      }



      const model = t2refresh.model ?? "gpt-4o-mini"
      logger.info(`fetching new quotes using model ${model}`)

      const prompt = t2refresh.promptliteral
         ? t2refresh.prompt
         : `create a list of 50 "message of the day" quotes ${t2refresh.prompt} formatted as an array of json objects containing the fields message and author`

      logger.info(`using prompt ${prompt}`)

      const quotesFile = DATA_DIR + `/${topic}.quotes.json`

      const openai = new OpenAI({ apiKey: process.env.GS_OPENAI_API_KEY })

      const response = await openai.chat.completions.create({ model: model, messages: [{ role: "user", content: [{ type: "text", text: prompt, }] }], max_tokens: 2000 })
      response.cid = t2refresh.id

      fs.writeJSONSync(quotesFile, response, { spaces: 3 })
   }

}
