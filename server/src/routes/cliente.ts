import express from "express"
import { PrismaClient } from "@prisma/client"
import axios from "axios"

const router = express.Router()
const prisma = new PrismaClient()

const convertBigIntToString = (cliente: any) => ({
  ...cliente,
  id: cliente.id.toString(),
  idUsuario: cliente.idUsuario.toString(),
})

router.get("/", async (req, res) => {
  try {
    const { codigo, nome, cidade, cep, page = 1, limit = 10 } = req.query

    const where: any = {}

    if (codigo) {
      where.codigo = { contains: codigo as string }
    }
    if (nome) {
      where.nome = { contains: nome as string, mode: "insensitive" }
    }
    if (cidade) {
      where.cidade = { contains: cidade as string, mode: "insensitive" }
    }
    if (cep) {
      where.cep = Number.parseInt(cep as string)
    }

    const skip = (Number.parseInt(page as string) - 1) * Number.parseInt(limit as string)

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: Number.parseInt(limit as string),
        orderBy: { dataHoraCadastro: "desc" },
      }),
      prisma.cliente.count({ where }),
    ])

    const clientesResponse = clientes.map(convertBigIntToString)

    res.json({
      data: clientesResponse,
      pagination: {
        page: Number.parseInt(page as string),
        limit: Number.parseInt(limit as string),
        total,
        pages: Math.ceil(total / Number.parseInt(limit as string)),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    res.status(500).json({ error: "Failed to fetch customers" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const cliente = await prisma.cliente.findUnique({
      where: { id: BigInt(id) },
    })

    if (!cliente) {
      return res.status(404).json({ error: "Customer not found" })
    }

    const clienteResponse = convertBigIntToString(cliente)

    res.json(clienteResponse)
  } catch (error) {
    console.error("Error fetching customer:", error)
    res.status(500).json({ error: "Failed to fetch customer" })
  }
})

router.post("/", async (req, res) => {
  try {
    const {
      idUsuario,
      codigo,
      nome,
      cpfCnpj,
      cep,
      logradouro,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
      complemento,
      fone,
      limiteCredito,
      validade,
    } = req.body

    if (!idUsuario || !codigo || !nome || !cpfCnpj || !cep || !fone || limiteCredito === undefined || !validade) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const cliente = await prisma.cliente.create({
      data: {
        idUsuario: BigInt(idUsuario),
        codigo,
        nome,
        cpfCnpj,
        cep: Number.parseInt(cep),
        logradouro: logradouro || "",
        endereco: endereco || "",
        numero: numero || "",
        bairro: bairro || "",
        cidade: cidade || "",
        uf: uf || "",
        complemento,
        fone,
        limiteCredito: Number.parseFloat(limiteCredito),
        validade: new Date(validade),
      },
    })

    const clienteResponse = convertBigIntToString(cliente)

    res.status(201).json(clienteResponse)
  } catch (error) {
    console.error("Error creating customer:", error)
    res.status(500).json({ error: "Failed to create customer" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const {
      idUsuario,
      codigo,
      nome,
      cpfCnpj,
      cep,
      logradouro,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
      complemento,
      fone,
      limiteCredito,
      validade,
    } = req.body

    const updateData: any = {}

    if (idUsuario !== undefined) updateData.idUsuario = BigInt(idUsuario)
    if (codigo !== undefined) updateData.codigo = codigo
    if (nome !== undefined) updateData.nome = nome
    if (cpfCnpj !== undefined) updateData.cpfCnpj = cpfCnpj
    if (cep !== undefined) updateData.cep = Number.parseInt(cep)
    if (logradouro !== undefined) updateData.logradouro = logradouro
    if (endereco !== undefined) updateData.endereco = endereco
    if (numero !== undefined) updateData.numero = numero
    if (bairro !== undefined) updateData.bairro = bairro
    if (cidade !== undefined) updateData.cidade = cidade
    if (uf !== undefined) updateData.uf = uf
    if (complemento !== undefined) updateData.complemento = complemento
    if (fone !== undefined) updateData.fone = fone
    if (limiteCredito !== undefined) updateData.limiteCredito = Number.parseFloat(limiteCredito)
    if (validade !== undefined) updateData.validade = new Date(validade)

    const cliente = await prisma.cliente.update({
      where: { id: BigInt(id) },
      data: updateData,
    })

    const clienteResponse = convertBigIntToString(cliente)

    res.json(clienteResponse)
  } catch (error) {
    console.error("Error updating customer:", error)
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Customer not found" })
    }
    res.status(500).json({ error: "Failed to update customer" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.cliente.delete({
      where: { id: BigInt(id) },
    })

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting customer:", error)
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Customer not found" })
    }
    res.status(500).json({ error: "Failed to delete customer" })
  }
})

router.get("/cep/:cep", async (req, res) => {
  try {
    const { cep } = req.params

    const cleanCep = cep.replace(/\D/g, "")

    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: "Invalid CEP format" })
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)

    if (response.data.erro) {
      return res.status(404).json({ error: "CEP not found" })
    }

    const addressData = {
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      complemento: response.data.complemento,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      uf: response.data.uf,
    }

    res.json(addressData)
  } catch (error) {
    console.error("Error fetching CEP:", error)
    res.status(500).json({ error: "Failed to fetch address data" })
  }
})

export default router
