
export interface VehicleData {
  modelo: string;
  ano: string;
  motor: string;
  km: string;
  cambio: string;
}

export interface Symptoms {
  // Outros por Grupo (Removido 1)
  outroGrupo2: string;
  outroGrupo3: string;
  outroGrupo4: string;
  outroGrupo5: string;
  outroGrupo6: string;
  outroGrupo7: string;
  outroGrupo8: string;
  outroGrupo9: string;

  // 2. Sintoma Principal
  luzes: string[];
  motorComportamento: string[];
  corFumaca: string;
  direcaoSuspensao: string[];
  freios: string[];
  
  // 3. Ruídos
  ruidosTipo: string[];
  ruidosOrigem: string[];
  especificacaoRoda: string;

  // 4. Condições
  condicoesTemperatura: string[];
  condicoesVelocidade: string[];
  condicoesClima: string[];

  // 5. Histórico
  historicoRecente: string[]; // Padronizado como lista de seleção
  manutencaoRecenteDetalhe: string;

  // 6. Cheiros
  cheiros: string[];

  // 7. Fluidos
  vazamentos: string[];
  fluidosNivel: string[];

  // 8. Transmissão
  transmissao: string[];

  // 9. Elétrica
  idadeBateria: string;
  eletricaPartida: string[];
  eletricaAcessorios: string[];

  // 10. Frequência e Relato
  frequencia: string;
  relato: string;
}

export interface DiagnosticResult {
  text: string;
  timestamp: number;
}
