'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating an executive summary for Owner/HR Manager dashboards.
 * It synthesizes key HR metrics, employee activity, and leave trends into a concise overview.
 *
 * - ownerExecutiveDashboardSummary - A function that generates an AI-powered executive summary.
 * - OwnerExecutiveDashboardSummaryInput - The input type for the ownerExecutiveDashboardSummary function.
 * - OwnerExecutiveDashboardSummaryOutput - The return type for the ownerExecutiveDashboardSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OwnerExecutiveDashboardSummaryInputSchema = z.object({
  activeEmployeesCount: z.number().describe('The total number of active employees.'),
  onLeaveEmployeesCount: z.number().describe('The total number of employees currently on leave.'),
  totalDepartmentsCount: z.number().describe('The total number of departments in the company.'),
  pendingLeaveCount: z.number().describe('The number of leave requests currently pending approval.'),
  departmentSummaries: z.array(
    z.object({
      departmentName: z.string().describe('The name of the department.'),
      managerName: z.string().describe('The name of the department manager.'),
      employeeCount: z.number().describe('The number of employees in this department.'),
    })
  ).describe('A summary of each department including its manager and employee count.'),
  recentHiringCount: z.number().describe('The number of new employees hired in the last month/quarter.'),
  recentTerminationCount: z.number().describe('The number of employee terminations in the last month/quarter.'),
  averageSickLeaveDays: z.number().describe('The average number of sick leave days per employee in the last quarter.'),
  topLeaveReasons: z.array(z.string()).describe('A list of the most common reasons for leave requests.'),
});
export type OwnerExecutiveDashboardSummaryInput = z.infer<typeof OwnerExecutiveDashboardSummaryInputSchema>;

const OwnerExecutiveDashboardSummaryOutputSchema = z.string().describe('An AI-generated executive summary of HR metrics, employee activity, and leave trends.');
export type OwnerExecutiveDashboardSummaryOutput = z.infer<typeof OwnerExecutiveDashboardSummaryOutputSchema>;

export async function ownerExecutiveDashboardSummary(input: OwnerExecutiveDashboardSummaryInput): Promise<OwnerExecutiveDashboardSummaryOutput> {
  return ownerExecutiveDashboardSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ownerExecutiveDashboardSummaryPrompt',
  input: {schema: OwnerExecutiveDashboardSummaryInputSchema},
  output: {schema: OwnerExecutiveDashboardSummaryOutputSchema},
  prompt: `You are an experienced HR Director tasked with providing a concise executive summary of the company's current HR status to the owner.
Your summary should highlight key HR metrics, employee activity, and leave trends.
Be professional, analytical, and provide actionable insights where appropriate.

Here is the data:

Current Employees: {{{activeEmployeesCount}}}
Employees On Leave: {{{onLeaveEmployeesCount}}}
Total Departments: {{{totalDepartmentsCount}}}
Pending Leave Requests: {{{pendingLeaveCount}}}
New Hires (last quarter): {{{recentHiringCount}}}
Terminations (last quarter): {{{recentTerminationCount}}}
Average Sick Leave Days (last quarter): {{{averageSickLeaveDays}}}

Department Overviews:
{{#each departmentSummaries}}
- Department: {{{departmentName}}}, Manager: {{{managerName}}}, Employees: {{{employeeCount}}}
{{/each}}

Top Reasons for Leave:
{{#each topLeaveReasons}}
- {{{this}}}
{{/each}}

Based on this data, please provide a comprehensive executive summary (around 200-300 words).`,
});

const ownerExecutiveDashboardSummaryFlow = ai.defineFlow(
  {
    name: 'ownerExecutiveDashboardSummaryFlow',
    inputSchema: OwnerExecutiveDashboardSummaryInputSchema,
    outputSchema: OwnerExecutiveDashboardSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
