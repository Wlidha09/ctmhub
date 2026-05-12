'use server';
/**
 * @fileOverview This file implements a Genkit flow for HR managers to automatically generate optimized monthly meal and transport voucher allocations for employees based on their attendance records and company policies.
 *
 * - hrManagerAutomatedVoucherAllocation - A function that handles the automated voucher allocation process.
 * - HrManagerAutomatedVoucherAllocationInput - The input type for the hrManagerAutomatedVoucherAllocation function.
 * - HrManagerAutomatedVoucherAllocationOutput - The return type for the hrManagerAutomatedVoucherAllocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Define the input schema for the *flow wrapper function* and *ai.defineFlow*
const HrManagerAutomatedVoucherAllocationInputSchema = z.object({
  attendanceRecords: z.array(
    z.object({
      employeeId: z.string().describe('Unique identifier for the employee.'),
      date: z.string().describe('Date of attendance in YYYY-MM-DD format.'),
      inOffice: z.boolean().describe('True if the employee was in the office on this date, false otherwise.'),
    })
  ).describe('Monthly attendance records for all relevant employees.'),
  companyPolicies: z.object({
    mealVoucherPerDay: z.number().describe('The value or count of one meal voucher per day in office.'),
    transportVoucherPerDay: z.number().describe('The value or count of one transport voucher per day in office.'),
    employees: z.array(
      z.object({
        id: z.string().describe('Employee ID'),
        name: z.string().describe('Employee Name'),
      })
    ).describe('List of all employees with their IDs and names.'),
  }).describe('Company policies defining voucher amounts and employee list.'),
});
export type HrManagerAutomatedVoucherAllocationInput = z.infer<typeof HrManagerAutomatedVoucherAllocationInputSchema>;

// 2. Define the output schema
const HrManagerAutomatedVoucherAllocationOutputSchema = z.object({
  allocations: z.array(
    z.object({
      employeeId: z.string().describe('ID of the employee.'),
      employeeName: z.string().describe('Name of the employee.'),
      mealVouchers: z.number().describe('Number of meal vouchers allocated.'),
      transportVouchers: z.number().describe('Number of transport vouchers allocated.'),
    })
  ).describe('List of allocated vouchers per employee.'),
  summary: z.string().describe('A textual summary of the voucher allocation process and results.'),
});
export type HrManagerAutomatedVoucherAllocationOutput = z.infer<typeof HrManagerAutomatedVoucherAllocationOutputSchema>;

// 3. Define the input schema specifically for the LLM prompt, after pre-processing
const AutomatedVoucherPromptInputSchema = z.object({
  employeeAttendanceSummary: z.array(
    z.object({
      employeeId: z.string().describe('Unique identifier for the employee.'),
      employeeName: z.string().describe('Name of the employee.'),
      officeDays: z.number().describe('Total number of days the employee was in the office.'),
    })
  ).describe('Summarized office attendance for employees for the month.'),
  companyPolicies: z.object({
    mealVoucherPerDay: z.number().describe('The value or count of one meal voucher per day in office.'),
    transportVoucherPerDay: z.number().describe('The value or count of one transport voucher per day in office.'),
  }).describe('Relevant company policies for voucher calculation.'),
});
type AutomatedVoucherPromptInput = z.infer<typeof AutomatedVoucherPromptInputSchema>;


// 4. Define the prompt
const hrManagerAutomatedVoucherAllocationPrompt = ai.definePrompt({
  name: 'hrManagerAutomatedVoucherAllocationPrompt',
  input: {schema: AutomatedVoucherPromptInputSchema},
  output: {schema: HrManagerAutomatedVoucherAllocationOutputSchema},
  prompt: `You are an expert HR manager tasked with calculating monthly meal and transport voucher allocations for employees.
You will receive a summary of each employee's office attendance for the month and company policies regarding voucher values.

Your goal is to calculate the total number of meal vouchers and transport vouchers for each employee based on their in-office days and the provided company policies.

Employee attendance summary for the month:
{{#each employeeAttendanceSummary}}
Employee ID: {{{employeeId}}}, Name: {{{employeeName}}}, Days in office: {{{officeDays}}}
{{/each}}

Company Policies:
Meal Voucher per day in office: {{{companyPolicies.mealVoucherPerDay}}}
Transport Voucher per day in office: {{{companyPolicies.transportVoucherPerDay}}}

Based on the above information, calculate the allocations for each employee. For each employee, the number of meal vouchers is 'Days in office' * 'Meal Voucher per day' and similarly for transport vouchers.

Finally, provide the allocations for each employee and a comprehensive summary of the entire allocation process for the month.

Ensure the output strictly adheres to the HrManagerAutomatedVoucherAllocationOutputSchema, specifically for the 'allocations' array and the 'summary' field.`,
});

// 5. Define the flow
const hrManagerAutomatedVoucherAllocationFlow = ai.defineFlow(
  {
    name: 'hrManagerAutomatedVoucherAllocationFlow',
    inputSchema: HrManagerAutomatedVoucherAllocationInputSchema,
    outputSchema: HrManagerAutomatedVoucherAllocationOutputSchema,
  },
  async (input) => {
    // Pre-process attendance records to summarize office days per employee
    const employeeOfficeDaysMap: { [key: string]: { name: string; officeDays: number } } = {};

    // Initialize employeeOfficeDaysMap with employee names from company policies
    input.companyPolicies.employees.forEach(emp => {
      employeeOfficeDaysMap[emp.id] = { name: emp.name, officeDays: 0 };
    });

    // Populate officeDays count based on attendance records
    input.attendanceRecords.forEach(record => {
      if (record.inOffice && employeeOfficeDaysMap[record.employeeId]) {
        employeeOfficeDaysMap[record.employeeId].officeDays++;
      }
    });

    const employeeAttendanceSummary: AutomatedVoucherPromptInput['employeeAttendanceSummary'] = Object.entries(employeeOfficeDaysMap).map(([employeeId, data]) => ({
      employeeId,
      employeeName: data.name,
      officeDays: data.officeDays,
    }));

    // Prepare the input for the prompt
    const promptInput: AutomatedVoucherPromptInput = {
      employeeAttendanceSummary: employeeAttendanceSummary,
      companyPolicies: {
        mealVoucherPerDay: input.companyPolicies.mealVoucherPerDay,
        transportVoucherPerDay: input.companyPolicies.transportVoucherPerDay,
      },
    };

    // Call the prompt with the pre-processed data
    const {output} = await hrManagerAutomatedVoucherAllocationPrompt(promptInput);

    return output!;
  }
);

// 6. Export the wrapper function that calls the flow
export async function hrManagerAutomatedVoucherAllocation(input: HrManagerAutomatedVoucherAllocationInput): Promise<HrManagerAutomatedVoucherAllocationOutput> {
  return hrManagerAutomatedVoucherAllocationFlow(input);
}
