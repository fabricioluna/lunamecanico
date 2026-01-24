
export interface VehicleData {
  plate?: string;
  model: string;
  year: string;
  km: string;
  engine: string;
  transmission: string;
  fuel: string;
}

export interface Symptoms {
  noises: string[];
  othersNoises?: string;
  sensations: string[];
  othersSensations?: string;
  dashboard: string[];
  othersDashboard?: string;
}

export interface ContextData {
  frequency: string;
  condition: string;
  othersCondition?: string;
  history: string[];
  othersHistory?: string;
}

export interface DiagnosisFormData {
  vehicle: VehicleData;
  report: string;
  symptoms: Symptoms;
  context: ContextData;
}
