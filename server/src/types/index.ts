export interface Cliente {
  id: bigint
  idUsuario: bigint
  dataHoraCadastro: Date
  codigo: string
  nome: string
  cpfCnpj: string
  cep: number
  logradouro: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  complemento?: string
  fone: string
  limiteCredito: number
  validade: Date
}

export interface CreateClienteRequest {
  idUsuario: string
  codigo: string
  nome: string
  cpfCnpj: string
  cep: string
  logradouro?: string
  endereco?: string
  numero?: string
  bairro?: string
  cidade?: string
  uf?: string
  complemento?: string
  fone: string
  limiteCredito: string
  validade: string
}

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}
