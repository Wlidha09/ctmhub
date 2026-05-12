/**
 * Tunisian Payroll Calculation Engine
 * Values based on common 2024/2025 standards in Tunisia.
 */

export interface PayrollInput {
  grossSalary: number;
  transportAllowance: number;
  presenceAllowance: number;
  childrenCount: number;
  isSpouseWorker: boolean;
}

export interface PayrollOutput {
  grossSalary: number;
  cnss: number;
  taxableSalary: number;
  irpp: number;
  netSalary: number;
}

export const calculateTunisianPayroll = (input: PayrollInput): PayrollOutput => {
  const { grossSalary, transportAllowance, presenceAllowance, childrenCount, isSpouseWorker } = input;
  
  // 1. Total Gross (including allowances)
  const totalGross = grossSalary + transportAllowance + presenceAllowance;

  // 2. CNSS (Caisse Nationale de Sécurité Sociale) - Employee part is 9.18%
  const cnssRate = 0.0918;
  const cnss = totalGross * cnssRate;

  // 3. Taxable Salary (Total Gross - CNSS)
  const taxableSalary = totalGross - cnss;

  // 4. IRPP (Impôt sur le Revenu des Personnes Physiques)
  // Monthly taxable basis simplified calculation for demonstration
  // Real calculation involves annualizing, applying brackets, and deductions
  let annualTaxable = taxableSalary * 12;
  
  // Standard Deductions
  annualTaxable *= 0.9; // 10% Professional expenses deduction
  
  // Chef de famille deduction (if applicable - simplified)
  let headOfFamilyDeduction = 300; // TND
  let childrenDeduction = childrenCount * 100; // TND per child
  annualTaxable -= (headOfFamilyDeduction + childrenDeduction);
  if (annualTaxable < 0) annualTaxable = 0;

  // Brackets 2024 (simplified)
  // 0-5k: 0%
  // 5k-20k: 26%
  // 20k-30k: 28%
  // 30k-50k: 32%
  // 50k+: 35%
  let annualTax = 0;
  if (annualTaxable > 5000) {
    const taxedAmount = Math.min(annualTaxable, 20000) - 5000;
    annualTax += taxedAmount * 0.26;
  }
  if (annualTaxable > 20000) {
    const taxedAmount = Math.min(annualTaxable, 30000) - 20000;
    annualTax += taxedAmount * 0.28;
  }
  // Simplified for demo

  const irpp = annualTax / 12;

  // 5. Net Salary
  const netSalary = taxableSalary - irpp;

  return {
    grossSalary: totalGross,
    cnss,
    taxableSalary,
    irpp,
    netSalary: Math.round(netSalary * 1000) / 1000,
  };
};