"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { customerApi, type CreateCustomerData } from "../services/api"

interface FormData extends CreateCustomerData {}

const CustomerForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      idUsuario: "1", // Default user ID
    },
  })

  const cepValue = watch("cep")

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "")

    if (cleanCep.length === 8) {
      setCepLoading(true)
      try {
        const addressData = await customerApi.getAddressByCep(cleanCep)

        // Auto-fill address fields
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
    try {
      setLoading(true)
      setError(null)

      await customerApi.createCustomer(data)
      navigate("/customers")
    } catch (err) {
      setError("Erro ao criar cliente")
      console.error("Error creating customer:", err)
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
      // CPF format: 000.000.000-00
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
      // CNPJ format: 00.000.000/0000-00
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
      // Landline: (00) 0000-0000
      return cleanValue.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
    } else {
      // Mobile: (00) 00000-0000
      return cleanValue.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
        <p className="text-gray-600">Preencha os dados do cliente</p>
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

        {/* Address Information */}
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
            {loading ? "Salvando..." : "Salvar Cliente"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CustomerForm
