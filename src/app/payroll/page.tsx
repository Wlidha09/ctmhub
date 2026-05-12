"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculateTunisianPayroll, PayrollOutput } from "./lib/calculations";
import { FileText, Download, Wallet, CreditCard, Landmark } from "lucide-react";

export default function PayrollPage() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    grossSalary: 2500,
    transportAllowance: 150,
    presenceAllowance: 50,
    childrenCount: 0,
    isSpouseWorker: false,
  });

  const [results, setResults] = useState<PayrollOutput | null>(null);

  const handleCalculate = () => {
    const res = calculateTunisianPayroll(inputs);
    setResults(res);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Gestion de la Paie</h1>
          <p className="text-muted-foreground">Calculez vos salaires et générez vos fiches de paie (Modèle Tunisien).</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">
          <Download className="w-4 h-4" /> Télécharger l'historique
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Paramètres de Paie</CardTitle>
            <CardDescription>Saisissez les éléments fixes et variables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gross">Salaire Brut (TND)</Label>
              <Input 
                id="gross" 
                type="number" 
                value={inputs.grossSalary} 
                onChange={e => setInputs({...inputs, grossSalary: parseFloat(e.target.value)})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transport">Ind. Transport</Label>
                <Input 
                  id="transport" 
                  type="number" 
                  value={inputs.transportAllowance} 
                  onChange={e => setInputs({...inputs, transportAllowance: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presence">Ind. Présence</Label>
                <Input 
                  id="presence" 
                  type="number" 
                  value={inputs.presenceAllowance} 
                  onChange={e => setInputs({...inputs, presenceAllowance: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Nombre d'enfants</Label>
              <Input 
                id="children" 
                type="number" 
                value={inputs.childrenCount} 
                onChange={e => setInputs({...inputs, childrenCount: parseInt(e.target.value)})} 
              />
            </div>
            <Button className="w-full bg-primary mt-4" onClick={handleCalculate}>Calculer maintenant</Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {results ? (
            <Card className="border-none shadow-lg overflow-hidden border-t-4 border-t-accent">
              <CardHeader className="bg-muted/30 pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-headline font-bold text-primary">Fiche de Paie Numérique</CardTitle>
                    <CardDescription>Période: Mai 2025</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.department} • Mat: 4509</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Éléments de Salaire</h3>
                      <div className="flex justify-between text-sm">
                        <span>Salaire de Base</span>
                        <span className="font-mono">{inputs.grossSalary.toFixed(3)} TND</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Indemnité Transport</span>
                        <span className="font-mono">{inputs.transportAllowance.toFixed(3)} TND</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Indemnité Présence</span>
                        <span className="font-mono">{inputs.presenceAllowance.toFixed(3)} TND</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>TOTAL BRUT</span>
                        <span className="font-mono">{results.grossSalary.toFixed(3)} TND</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Retenues & Taxes</h3>
                      <div className="flex justify-between text-sm text-red-500">
                        <span>CNSS (9.18%)</span>
                        <span className="font-mono">-{results.cnss.toFixed(3)} TND</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-500">
                        <span>IRPP (Impôt)</span>
                        <span className="font-mono">-{results.irpp.toFixed(3)} TND</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-medium">
                        <span>Salaire Imposable</span>
                        <span className="font-mono">{results.taxableSalary.toFixed(3)} TND</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary p-6 rounded-2xl text-white flex justify-between items-center">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/70">Net à Payer</p>
                      <p className="text-4xl font-headline font-bold">{results.netSalary.toFixed(3)} TND</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70">Mode de paiement</p>
                      <p className="font-medium">Virement Bancaire</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 border-2 border-dashed rounded-3xl">
              <CreditCard className="w-12 h-12 mb-4 opacity-20" />
              <p>Configurez les paramètres à gauche pour générer votre simulation de paie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}