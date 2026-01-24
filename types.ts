
export interface FormData {
  veiculo: {
    marcaModelo: string;
    ano: string;
    km: string;
    motorizacao: string;
    cambio: string;
    combustivel: string;
  };
  relato: string;
  sintomas: {
    barulhos: string[];
    sensacoes: string[];
    visual: string[];
  };
  contexto: {
    frequencia: string;
    condicoes: string[];
    historico: string[];
  };
}

export interface DiagnosisResponse {
  titulo: string;
  causa: string;
  hipoteses: {
    alta: string;
    media: string;
    baixa: string;
  };
  passos: string[];
}
