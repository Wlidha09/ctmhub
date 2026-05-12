"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS, ROLES } from "@/app/lib/roles";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const { completeOnboarding, user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    dob: "",
    phone: "",
    department: "",
    role: "Employee",
    officeDaysPerWeek: 3,
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (!formData.department || !formData.dob || !formData.phone) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations requises.",
        variant: "destructive"
      });
      return;
    }
    completeOnboarding(formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl border-none">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Etape {step} sur 3</span>
            <Progress value={(step / 3) * 100} className="w-32 h-2" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">Finalisez votre profil</CardTitle>
          <CardDescription>
            Nous avons besoin de quelques informations supplémentaires pour configurer votre compte CTM Hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="name">Nom Complet</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date de Naissance</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de Téléphone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+216 -- --- ---"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept">Département</Label>
                <Select onValueChange={(v) => setFormData({...formData, department: v})}>
                  <SelectTrigger id="dept">
                    <SelectValue placeholder="Choisir un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle (Simulation Admin)</Label>
                <Select onValueChange={(v) => setFormData({...formData, role: v as any})}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Attribuer un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Jours de présence au bureau / semaine</Label>
                <Select defaultValue="3" onValueChange={(v) => setFormData({...formData, officeDaysPerWeek: parseInt(v)})}>
                  <SelectTrigger id="days">
                    <SelectValue placeholder="3 jours" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n} jours</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Précédent</Button>
          {step < 3 ? (
            <Button onClick={nextStep} className="px-8">Suivant</Button>
          ) : (
            <Button onClick={handleSubmit} className="px-8 bg-accent hover:bg-accent/90">Terminer</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}