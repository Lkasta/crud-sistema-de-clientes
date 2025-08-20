import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Customer {
  id: string;
  idUsuario: string;
  dataHoraCadastro: string;
  codigo: string;
  nome: string;
  cpfCnpj: string;
  cep: number;
  logradouro: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  fone: string;
  limiteCredito: number;
  validade: string;
}

export interface CreateCustomerData {
  idUsuario: string;
  codigo: string;
  nome: string;
  cpfCnpj: string;
  cep: string;
  logradouro: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  fone: string;
  limiteCredito: string;
  validade: string;
}

export interface ViaCepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface CustomerFilters {
  codigo?: string;
  nome?: string;
  cidade?: string;
  cep?: string;
  page?: number;
  limit?: number;
}

export interface CustomerListResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const customerApi = {
  getCustomers: async (
    filters: CustomerFilters = {}
  ): Promise<CustomerListResponse> => {
    const response = await api.get("/clientes", { params: filters });
    return response.data;
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  createCustomer: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await api.post("/clientes", data);
    return response.data;
  },

  updateCustomer: async (
    id: string,
    data: Partial<CreateCustomerData>
  ): Promise<Customer> => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  getAddressByCep: async (cep: string): Promise<ViaCepData> => {
    const response = await api.get(`/clientes/cep/${cep}`);
    return response.data;
  },
};

export default api;
