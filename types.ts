
export interface VehicleData {
  placa: string;
  modelo: string;
  ano: string;
  km: string;
  motor: string;
  cambio: string;
  combustivel: string;
}

export interface Symptoms {
  barulhos: string[];
  sensacoes: string[];
  painel: string[];
}

export interface ContextData {
  frequencia: string;
  condicao: string[];
  historico: string[];
}

export interface AnamneseForm {
  veiculo: VehicleData;
  relato: string;
  sintomas: Symptoms;
  contexto: ContextData;
}

export interface DiagnosticResult {
  markdown: string;
}
