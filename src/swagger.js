import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"


export default function swaggerSetup(app, env) {

   const swaggerSpec = swaggerJSDoc({
      definition: {
         openapi: "3.1.0",
         info: {
            version: env.version,
            title: env.name,
            description: env.description + `<br/><br/><a rel="noopener noreferrer" target="_blank" href="/v1/motd/openapi.json">The openapi source definition for motd</a>`,
            contact: {
               email: "api@codemarc.net",
            },
            externalDocs: {
               description: "GridSvcs API",
               url: "https://codemarc.net/doc/gridsvcs/#/",
            },
            license: {
               name: "MIT License",
               url: "https://codemarc.net/doc/LICENSE.txt",
            },
         },
         servers: [
            {
               url: "http://localhost:3000/",
               description: "Development server",
            },
            {
               url: "http://cli.gridsvcs-motd.orb.local/",
               description: "Development server in orbstack",
            },
            {
               url: "https://codemarc.net/api/",
               description: "Production server",
            },
         ],
         tags: [
            {
               name: "motd",
               description: "Message of the Day",
            },
         ],
      },
      apis: ["./src/*.js"],
   })

   app.use("/v1/motd/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

   app.get("/v1/motd/openapi.json", (req, res) => {
      res.setHeader("Content-Type", "application/json")
      res.send(swaggerSpec)
   })
}

