import { createClient } from "@supabase/supabase-js"
import fs from "fs-extra"
import logger from "./logger.js";
import path from "path"

// Query Service
export default class qqs {
   constructor(env) {
      this.env = env
   }

   async getTopics(cache) {
      const getTopicsFromSupabase = async () => {
         try {
            const supabase = createClient(this.env.supabaseProjectUrl, this.env.supabaseServiceKey) 
            const { data, error } = await supabase.from('topics').select('*')
            if (error) {
               throw error
            } else {
               return { status: 200, data: data }
            }
         } catch (err) {
            const errmsg = err.hasOwnProperty('message') ? err.message : err.toString()
            logger.error(errmsg)
            return { status: 500, data: errmsg }
         }
      }

      try {
         const cacheFileName = path.join(this.env.dataDir, 'topics.json')

         // Step 1: Check if cache parameter is set to false
         if (cache.toString() === 'false') {
            logger.info(`cache parameter is set to false, fetching topics from Supabase`)
            const rc = await getTopicsFromSupabase()
            if (rc.status !== 200) {
               return rc
            } else {
               logger.info(`topics cache created/updated`)
               fs.writeJSONSync(cacheFileName, rc.data, { spaces: 2 })
               return rc
            }
         }

         // Step 2: Check if topics.json exists
         if (!fs.existsSync(cacheFileName)) {
            logger.info(`topics cache does not exist, fetching topics from Supabase`)
            const rc = await getTopicsFromSupabase()
            if (rc.status !== 200) {
               return rc
            } else {
               logger.info(`topics cache created/updated`)
               fs.writeJSONSync(cacheFileName, rc.data, { spaces: 2 })
               return rc
            }
         }

         // Step 3: Check if the file is older than the TTL
         const stats = await fs.stat(cacheFileName)
         const ageInMilliseconds = new Date() - stats.mtime
         const ageInSeconds = Math.floor(ageInMilliseconds / 1000)

         // Default TTL is 2 hours (7200 seconds)
         const ttl = parseInt(this.env.cacheTopicsTTL, 10)

         if (ageInSeconds > ttl) {
            logger.info(`topics cache is older than TTL, fetching topics from Supabase`)
            const rc = await getTopicsFromSupabase()
            if (rc.status !== 200) {
               return rc
            } else {
               logger.info(`topics cache created/updated`)
               fs.writeJSONSync(cacheFileName, rc.data, { spaces: 2 })
               return rc
            }
         }

         // Step 4: Return the cached topics.json
         const data = fs.readJSONSync(cacheFileName)
         if (data.length === 0) {
            return { status: 404, data: "No topics found" }
         } else {
            return { status: 200, data: data }
         }
      } catch (err) {
         const errmsg = err.hasOwnProperty('message') ? err.message : err.toString()
         logger.error(errmsg)
         return { status: 500, data: errmsg }
      }
   }

   async getQuotes(topic = "general") {
      try {
         const data = await fs.readJSONSync(this.env.dataDir + `/${topic}.data.json`)
         if (data.length == 0) {
            return { status: 404, data: "No quotes found" }
         } else {
            return { status: 200, data: data }
         }
      } catch (error) {
         if (error.code === 'ENOENT') {
            return { status: 404, data: `No quotes found for topic ${topic}` }
         } else {
            return { status: 500, data: error.toString() }
         }
      }
   }

   async getStatus() {
      try {
         const supabase = createClient(this.env.supabaseProjectUrl, this.env.supabaseAnonKey)
         const { data, error } = await supabase.from('topics').select('topic,model,usage')

         let rc = {
            version: this.env.version,
            build: "" + this.env.build,
            topics: data ?? error
         }
         return { status: 200, data: rc }
      } catch (err) {
         return { status: 500, data: err.toString() }
      }
   }
}
