
export interface VehicleData {
  modelo: string;
  ano: string;
  motor: string;
  km: string;
  cambio: string;
}

export interface Symptoms {
  luzes: string;
  motorComp: string;
  corFumaca: string;
  dirSusp: string;
  freios: string;
  ruidoTipo: string;
  ruidoOrigem: string;
  rodaSpec: string;
  condicoes: string;
  historico: string;
  manutDetalhe: string;
  cheiros: string;
  manchas: string;
  niveis: string;
  manualComp: string;
  autoComp: string;
  eletricaPartida: string;
  eletricaAcess: string;
  idadeBateria: string;
  frequencia: string;
  relato: string;
  extras: {
    g2: string;
    g3: string;
    g4: string;
    g5: string;
    g6: string;
    g7: string;
    g8: string;
    g9: string;
  };
}
