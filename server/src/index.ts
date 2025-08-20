import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import clienteRoutes from "./routes/cliente"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use("/clientes", clienteRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Customer Management API is running" })
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export { prisma }
