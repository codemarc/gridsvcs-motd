#!/usr/bin/env node --no-warnings
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import fs from "fs-extra"
import qqs from "./qqs.js"
import logger from "./logger.js"
import swaggerSetup from "./swagger.js"

const HTMLSTART = (title, body) => {
   return `<html lang="en">
   <head>
      <title>${title}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Mukta:400,500,600,700&amp;display=swap">
      <style type="text/css">
      body {padding:20px;font-family: 'Mukta', sans-serif;font-size: 16px;font-weight: 40;}</style>
   </head>
   <body>
     <h1>${title}</h1>
     ${body}
   </body>
</html>`
}


export function server() {
   const app = express()
   const PORT = process.env.GS_PORT ?? 3000

   // express middleware
   app.use(bodyParser.json())
   app.use(cors())
   app.use(helmet())

   // Instantiate the query service
   const qq = new qqs()

   // Status and Metrics
   /**
    * @swagger
    * /v1/motd/status:
    *   get:
    *     tags: [motd]
    *     summary: Status for the motd service
    *     responses:
    *       200:
    *         description: The message of the day service stats
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 ts:
    *                   type: string
    *                   example: "2023-07-18T18:40:00.000Z"
    *                 version:
    *                   type: string
    *                   example: "0.0.0"
    *                 build:
    *                   type: string
    *                   example: "240801000"
    *                 topics:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       topic:
    *                         type: string
    *                         example: "general"
    *                       model:
    *                         type: string
    *                         example: "gpt-4o-mini"
    *                       usage:
    *                         type: object
    *                         properties:
    *                           prompt_tokens:
    *                             type: integer
    *                             example: 33
    *                           completion_tokens:
    *                             type: integer
    *                             example: 1436
    *                           total_tokens:
    *                             type: integer
    *                             example: 1469
    *                         nullable: true
    *       500:
    *         description: Internal server error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 500
    *                 data:
    *                   type: string
    *                   example: "Error: something is amis"
    *
    */
   app.get("/v1/motd/status", async (req, res) => {
      logger.info(`GET /v1/motd/status`)
      const { format } = req.query
      const now = () => 'status as of ' + new Date().toLocaleString()
      const result = await qq.getStatus()

      if (format === "html") {
         res.setHeader("Content-Type", "text/html")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(HTMLSTART(now(), `<p>${result.data}</p>`))
            } else {
               res.status(result.status).send(HTMLSTART(now(), `<p>status is currently unavailable</p>`))
            }
         } else {
            res.status(result.status).send(HTMLSTART(now(), `<p>${JSON.stringify(result.data)}</p>`))
         }

      } else if (format === "text") {
         res.setHeader("Content-Type", "text/plain")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(result.data)
            } else {
               res.status(result.status).send(`  ${now()} \n\nstatus is currently unavailable\n\n`)
            }
         } else {
            res.status(result.status).send(`  ${now()} ${JSON.stringify(result.data)}\n\n`)
         }

      } else {
         res.setHeader("Content-Type", "application/json")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            res.status(result.status).send(result)
         } else {
            res.status(result.status).send(Object.assign({ ts: new Date() }, result.data))
         }
      }
   })

   // Read all items using CQRS pattern

   /**
    * @swagger
    * components:
    *   schemas:
    *     Quote:
    *       type: object
    *       properties:
    *         message:
    *           type: string
    *           description: The quote message
    *           example: The only way to do great work is to love what you do.
    *         author:
    *           type: string
    *           description: The author of the quote
    *           example: Steve Jobs
    *     QuoteArray:
    *       type: array
    *       items:
    *         $ref: '#/components/schemas/Quote'
    */

   /**
    * @swagger
    * /v1/motd/quotes:
    *   get:
    *     tags: [motd]
    *     summary: Current quotes list
    *     parameters:
    *       - in: query
    *         name: topic
    *         schema:
    *           type: string
    *         description: Optional topic to filter quotes
    *       - in: query
    *         name: format
    *         schema:
    *           type: string
    *           enum: [json, html, text]
    *         description: Optional format of the response (json, html or text)*
    *     responses:
    *       200:
    *         description: A list of quotes
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/QuoteArray'
    *           text/html:
    *             schema:
    *               type: string
    *               example: "<p>The only way to do great work is to love what you do. - Steve Jobs</p>"
    *           text/plain:
    *             schema:
    *               type: string
    *               example: "The only way to do great work is to love what you do. - Steve Jobs"
    *       500:
    *         description: Internal server error
    */
   app.get("/v1/motd/quotes", async (req, res) => {
      logger.info(`GET /v1/motd/quotes`)
      const { topic, format } = req.query
      const result = await qq.getQuotes(topic)

      if (format === "html") {
         res.setHeader("Content-Type", "text/html")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(HTMLSTART("Quotes " + (topic ?? ""), `<p>${result.data}</p>`))
            } else {
               res.status(result.status).send(HTMLSTART("Quotes " + (topic ?? ""), `<p>quotes are not currently available</p>`))
            }
         } else {
            res.status(result.status).send(HTMLSTART("Quotes " + (topic ?? ""), `<ol>${result.data.map(quote => `<li>${quote.message} - ${quote.author}</li>`).join("")}</ol>`))
         }

      } else if (format === "text") {
         res.setHeader("Content-Type", "text/plain")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(result.data)
            } else {
               res.status(result.status).send(`Quotes ${topic ?? ""} \n\nquotes are not currently available\n\n`)
            }
         } else {
            res.status(result.status).send(`  Quotes ${topic ?? ""} \n\n${result.data.map((quote, ndx) => `  ${ndx + 1}. ${quote.message} - ${quote.author}`).join("\n\n")}`)
         }

      } else {
         res.setHeader("Content-Type", "application/json")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            res.status(result.status).send(result)
         } else {
            res.status(result.status).send(result.data)
         }
      }
   })

   /**
    * @swagger
    * components:
    *   schemas:
    *     TopicPrompt:
    *       type: object
    *       properties:
    *         topic:
    *           type: string
    *           description: The topic name
    *           example: Trump
    *         prompt:
    *           type: string
    *           description: The prompt related to the topic
    *           example: related to Donald Trump
    *     TopicPromptArray:
    *       type: array
    *       items:
    *         $ref: '#/components/schemas/TopicPrompt'
    */

   /**
    * @swagger
    * /v1/motd/topics:
    *   get:
    *     tags: [motd]
    *     summary: Retrieve a list of topic prompts
    *     parameters:
    *       - in: query
    *         name: format
    *         schema:
    *           type: string
    *           enum: [json, html, text]
    *         description: Optional format of the response (json, html or text)*
    *       - in: query
    *         name: cache
    *         schema:
    *           type: boolean
    *         description: Optional boolean to enable or disable caching
    *
    *     responses:
    *       200:
    *         description: A list of topic prompts
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/TopicPromptArray'
    *       500:
    *         description: Internal server error
    */
   app.get("/v1/motd/topics", async (req, res) => {

      logger.info(`GET /v1/motd/topics`)
      const { format, cache } = req.query
      const fullresult = await qq.getTopics(cache ?? true)

      // Transform fullresult
      const result = {
         status: fullresult.status,
         data: fullresult.data.map(t => ({
            topic: t.topic,
            prompt: t.prompt
         }))
      }

      if (format === "html") {
         res.setHeader("Content-Type", "text/html")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(HTMLSTART("Topics", `<p>${result.data}</p>`))
            } else {
               res.status(result.status).send(HTMLSTART("Topics", `<p>topics are currently unavailable</p>`))
            }
         } else {
            res.status(result.status).send(HTMLSTART("Topics", `<ol> ${result.data.map(item => `<li><a href="quotes?format=html&topic=${item.topic}">${item.topic} - ${item.prompt}</li>`).join("")}</ol > `))
         }
      } else if (format === "text") {
         res.setHeader("Content-Type", "text/plain")
         if (result.status !== 200) {
            logger.error(JSON.stringify(result))
            if (result.hasOwnProperty("data")) {
               res.status(result.status).send(result.data)
            } else {
               res.status(result.status).send(`  Topics\n\n  topics are currently unavailable\n\n`)
            }
         } else {
            res.status(result.status).send(`  Topics\n\n${result.data.map((item, ndx) => `  ${ndx + 1}. ${item.topic} - ${item.prompt}`).join("\n\n")}`)
         }
      } else {
         res.setHeader("Content-Type", "application/json")
         if (result.status !== 200) {
            res.status(result.status).send(result)
         } else {
            res.status(result.status).send(result.data)
         }
      }
   })


   // Stop the server
   app.get("/v1/motd/stop", async (req, res) => {
      logger.info("GET /v1/motd/stop")
      res.status(200).send("stopped")
      process.exit(0)
   })

   swaggerSetup(app)

   // Start the server
   app.listen(PORT, () => {
      logger.info(`server is running on http://localhost:${PORT}`)
      logger.info(`try http://localhost:${PORT}/v1/motd/api-docs`)
      logger.info(`try http://localhost:${PORT}/v1/motd/status`)
      logger.info(`try http://localhost:${PORT}/v1/motd/quotes`)
      logger.info(`try http://localhost:${PORT}/v1/motd/topics`)
      logger.info(`press CTRL+C to stop`)
   })
}