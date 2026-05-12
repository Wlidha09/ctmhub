"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { hrManagerAutomatedVoucherAllocation, HrManagerAutomatedVoucherAllocationOutput } from "@/ai/flows/hr-manager-automated-voucher-allocation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Ticket, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VoucherToolPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allocation, setAllocation] = useState<HrManagerAutomatedVoucherAllocationOutput | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Mocked attendance data for the AI flow
      const mockInput = {
        attendanceRecords: [
          { employeeId: '1', date: '2025-05-01', inOffice: true },
          { employeeId: '1', date: '2025-05-02', inOffice: true },
          { employeeId: '2', date: '2025-05-01', inOffice: false },
          { employeeId: '2', date: '2025-05-02', inOffice: true },
          { employeeId: '3', date: '2025-05-01', inOffice: true },
        ],
        companyPolicies: {
          mealVoucherPerDay: 1,
          transportVoucherPerDay: 1,
          employees: [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Sami Ben Salem' },
            { id: '3', name: 'Amira Khadraoui' },
          ]
        }
      };

      const result = await hrManagerAutomatedVoucherAllocation(mockInput);
      setAllocation(result);
      toast({
        title: "Allocation Générée",
        description: "L'IA a optimisé les tickets pour le mois de Mai.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'allocation par IA.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Tickets & Vouchers AI</h1>
          <p className="text-muted-foreground">Allocation intelligente des tickets restaurant et transport.</p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="bg-primary hover:bg-primary/90 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Générer avec l'IA
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {allocation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allocation.allocations.map((item, idx) => (
                <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4">
                    <CardTitle className="text-sm font-bold">{item.employeeName}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">ID: {item.employeeId}</Badge>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                           <Ticket className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Tickets Repas</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{item.mealVouchers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                           <RefreshCcw className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Tickets Transport</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{item.transportVouchers}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-white rounded-3xl border border-dashed">
              <Ticket className="w-12 h-12 mb-4 opacity-10" />
              <p>Cliquez sur "Générer avec l'IA" pour analyser l'assiduité.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Résumé IA</CardTitle>
            </CardHeader>
            <CardContent>
              {allocation ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {allocation.summary}
                  </p>
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-2 text-accent font-bold mb-2">
                      <CheckCircle className="w-4 h-4" /> Optimisation complétée
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Calculé sur la base de {user?.officeDaysPerWeek} jours contractuels et la présence réelle du mois dernier.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune donnée disponible.</p>
              )}
            </CardContent>
            {allocation && (
              <CardFooter>
                <Button className="w-full bg-accent">Approuver l'allocation</Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}