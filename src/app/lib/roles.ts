export type UserRole = 'Employee' | 'Manager' | 'HR' | 'Owner' | 'Dev';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  dob: string;
  phone: string;
  officeDaysPerWeek: number;
  avatarUrl: string;
  onboardingCompleted: boolean;
}

export const ROLES: UserRole[] = ['Employee', 'Manager', 'HR', 'Owner', 'Dev'];

export const DEPARTMENTS = [
  'Direction',
  'RH',
  'Finance',
  'IT',
  'Marketing',
  'Opérations',
  'Ventes'
];