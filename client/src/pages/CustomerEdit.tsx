"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { customerApi, type CreateCustomerData } from "../services/api"

interface FormData extends CreateCustomerData {}

const CustomerEdit: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const cepValue = watch("cep")

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return

      try {
        setInitialLoading(true)
        const customer = await customerApi.getCustomer(id)

        setValue("idUsuario", customer.idUsuario)
        setValue("codigo", customer.codigo)
        setValue("nome", customer.nome)
        setValue("cpfCnpj", customer.cpfCnpj)
        setValue("cep", customer.cep.toString())
        setValue("logradouro", customer.logradouro)
        setValue("endereco", customer.endereco)
        setValue("numero", customer.numero)
        setValue("bairro", customer.bairro)
        setValue("cidade", customer.cidade)
        setValue("uf", customer.uf)
        setValue("complemento", customer.complemento || "")
        setValue("fone", customer.fone)
        setValue("limiteCredito", customer.limiteCredito.toString())
        setValue("validade", customer.validade.split("T")[0]) 

        setError(null)
      } catch (err) {
        setError("Erro ao carregar dados do cliente")
        console.error("Error loading customer:", err)
      } finally {
        setInitialLoading(false)
      }
    }

    loadCustomer()
  }, [id, setValue])

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "")

    if (cleanCep.length === 8) {
      setCepLoading(true)
      try {
        const addressData = await customerApi.getAddressByCep(cleanCep)

        setValue("logradouro", addressData.logradouro)
        setValue("bairro", addressData.bairro)
        setValue("cidade", addressData.cidade)
        setValue("uf", addressData.uf)
        if (addressData.complemento) {
          setValue("complemento", addressData.complemento)
        }

        setError(null)
      } catch (err) {
        setError("CEP não encontrado ou inválido")
        console.error("Error fetching CEP:", err)
      } finally {
        setCepLoading(false)
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      await customerApi.updateCustomer(id, data)
      navigate("/customers")
    } catch (err) {
      setError("Erro ao atualizar cliente")
      console.error("Error updating customer:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCep = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 5) {
      return cleanValue
    }
    return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`
  }

  const formatCpfCnpj = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    }
  }

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 10) {
      return cleanValue.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
    } else {
      return cleanValue.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dados do cliente...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
        <p className="text-gray-600">Atualize os dados do cliente</p>
      </div>

      {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                {...register("codigo", { required: "Código é obrigatório" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: CLI001"
              />
              {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                {...register("nome", { required: "Nome é obrigatório" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ *</label>
              <input
                type="text"
                {...register("cpfCnpj", { required: "CPF/CNPJ é obrigatório" })}
                onChange={(e) => {
                  const formatted = formatCpfCnpj(e.target.value)
                  setValue("cpfCnpj", formatted)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
              {errors.cpfCnpj && <p className="mt-1 text-sm text-red-600">{errors.cpfCnpj.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input
                type="text"
                {...register("fone", { required: "Telefone é obrigatório" })}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setValue("fone", formatted)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(00) 00000-0000"
              />
              {errors.fone && <p className="mt-1 text-sm text-red-600">{errors.fone.message}</p>}
            </div>
          </div>
        </div>

        {/* Address Information with ViaCEP Integration */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP *{cepLoading && <span className="text-blue-600 ml-2">Buscando...</span>}
              </label>
              <input
                type="text"
                {...register("cep", { required: "CEP é obrigatório" })}
                onChange={(e) => {
                  const formatted = formatCep(e.target.value)
                  setValue("cep", formatted)
                  handleCepChange(formatted)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
                maxLength={9}
              />
              {errors.cep && <p className="mt-1 text-sm text-red-600">{errors.cep.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
              <input
                type="text"
                {...register("logradouro")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rua, Avenida, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                {...register("endereco")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                {...register("numero")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                {...register("bairro")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                {...register("cidade")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
              <input
                type="text"
                {...register("uf")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SP"
                maxLength={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input
                type="text"
                {...register("complemento")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apartamento, sala, etc."
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Financeiras</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Crédito *</label>
              <input
                type="number"
                step="0.01"
                {...register("limiteCredito", { required: "Limite de crédito é obrigatório" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.limiteCredito && <p className="mt-1 text-sm text-red-600">{errors.limiteCredito.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validade *</label>
              <input
                type="date"
                {...register("validade", { required: "Validade é obrigatória" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.validade && <p className="mt-1 text-sm text-red-600">{errors.validade.message}</p>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Atualizando..." : "Atualizar Cliente"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CustomerEdit
