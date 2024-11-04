#!/usr/bin/env node --no-warnings
import prog from "caporal"
import cqs from "./src/cqs.js"
import logger from "./src/logger.js"
import qqs from "./src/qqs.js"
import senv from "./src/senv.js"
import { server } from "./src/server.js"

try {
   const env = new senv()
   const { name, version, description, build } = env

   // =======================================================================
   // cli processing
   // =======================================================================
   prog
      .bin(name)
      .version(version)
      .description(description)

      // =====================================================================
      .command("env", "display environment")
      .action(async (args, options) => {
         env.setArgsOptions(args, options)
         await env.display()
      })

      // =====================================================================
      .command("refresh", "updates all cached data")
      .argument("[topic]", "topic to refresh", prog.STRING)
      .option("-l, --list", "topics", false)
      .option("-t, --topics", "refresh topics list", false)
      .option("-f, --force", "force a cache update", false)
      .option("-d, --database", "use database", false)
      .action(async (args, options) => {
         try {
            env.setArgsOptions(args, options)
            const qq = new qqs(env)
            const topics = await qq.getTopics(!options.topics)
            if (topics.status != 200) {
               logger.error(`https://supabase.com/dashboard/project/${env.supabaseProjectId}`)
               console.log(`error retrieving topic list`)
               console.log(`\n`)
               return
            }

            if (options.list || options.topics) {
               console.log(`\ntopics:`)
               topics.data.forEach(element => {
                  console.log(`\t${element.topic}`)
               })
               console.log(`\n`)
               return
            }

            if(args.topic) {
               if(topics.data.filter(x => x.topic == args.topic).length == 0) {
                  logger.error(`topic ${args.topic} not found`)
                  console.log(`\n`)
                  return
               }
            }

            let cq = new cqs(env) 
            logger.info(`refreshing quotes ${options.force ? "forced" : ""}`)
            cq.refreshQuotes(options, args.topic)
            logger.info(`refreshing quotes completes`)
         } catch (e) {
            throw e
         }
      })

      // =====================================================================
      .command("server", "start the service")
      .action(async (args, options) => {
         logger.info("starting server")
         env.setArgsOptions(args, options)
         server(env)
      })

   logger.info(`running ${name} cli v${version} (${build})`)
   if (process.argv.length === 2 && process.argv[1].includes("motd.js")) {
      process.argv.push("server")
   }

   prog.parse(process.argv)
} catch (err) {
   console.error(err)
}
