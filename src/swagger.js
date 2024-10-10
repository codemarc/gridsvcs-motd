import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import packageJson from "../package.json" assert { type: "json" }
const { name, version, description } = packageJson

const options = {
   definition: {
      openapi: "3.1.0",
      info: {
         version: version,
         title: name,
         description: description + `<br/><br/><a rel="noopener noreferrer" target="_blank" href="/v1/motd/openapi.json">The openapi source definition for motd</a>`,
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
};

const swaggerSpec = swaggerJSDoc(options)

export default function swaggerSetup(app) {
   app.use("/v1/motd/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

   app.get("/v1/motd/openapi.json", (req, res) => {
      res.setHeader("Content-Type", "application/json")
      res.send(swaggerSpec)
   })
}

