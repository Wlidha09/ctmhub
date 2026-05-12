"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DAYS = [
  { id: 'mon', label: 'Lundi' },
  { id: 'tue', label: 'Mardi' },
  { id: 'wed', label: 'Mercredi' },
  { id: 'thu', label: 'Jeudi' },
  { id: 'fri', label: 'Vendredi' },
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (id: string) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter(d => d !== id));
    } else {
      if (selectedDays.length >= (user?.officeDaysPerWeek || 3)) {
         toast({
           title: "Limite atteinte",
           description: `Votre contrat prévoit ${user?.officeDaysPerWeek} jours de bureau par semaine.`,
           variant: "destructive"
         });
         return;
      }
      setSelectedDays([...selectedDays, id]);
    }
  };

  const saveSelection = () => {
    toast({
      title: "Selection enregistrée",
      description: "Votre présence pour la semaine prochaine a été mise à jour.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Disponibilité Bureau</h1>
          <p className="text-muted-foreground">Planifiez vos jours de présence pour la semaine prochaine.</p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 rounded-xl text-md">
          Objectif: {user?.officeDaysPerWeek} jours / semaine
        </Badge>
      </div>

      <Card className="border-none shadow-sm max-w-4xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Calendar className="w-5 h-5" /> Semaine du 12 au 16 Mai 2025
          </div>
          <CardDescription>
            La sélection est réinitialisée automatiquement chaque lundi matin.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day.id);
              return (
                <div 
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={cn(
                    "relative cursor-pointer group rounded-2xl p-6 transition-all border-2",
                    isSelected 
                      ? "bg-primary border-primary text-white shadow-lg" 
                      : "bg-white border-transparent hover:border-accent hover:shadow-md"
                  )}
                >
                  {isSelected && <Check className="absolute top-2 right-2 w-4 h-4" />}
                  <p className={cn("text-xs uppercase tracking-widest font-bold", isSelected ? "text-white/70" : "text-muted-foreground")}>
                    {day.id}
                  </p>
                  <h3 className="text-xl font-headline font-bold mt-1">{day.label}</h3>
                  <div className={cn(
                    "mt-4 h-1 w-8 rounded-full",
                    isSelected ? "bg-accent" : "bg-muted group-hover:bg-accent/50"
                  )} />
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center p-6 bg-accent/5 rounded-3xl border border-accent/10">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                 <Info className="w-6 h-6 text-accent" />
               </div>
               <div>
                 <p className="font-bold text-primary">Statut de la sélection</p>
                 <p className="text-sm text-muted-foreground">
                   {selectedDays.length} jours sur {user?.officeDaysPerWeek} sélectionnés.
                 </p>
               </div>
            </div>
            <Button 
              size="lg" 
              className="px-8 rounded-xl bg-accent hover:bg-accent/90"
              onClick={saveSelection}
              disabled={selectedDays.length === 0}
            >
              Enregistrer ma sélection
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
         <Card className="border-none shadow-sm">
           <CardHeader>
             <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Pourquoi cette planification ?</CardTitle>
           </CardHeader>
           <CardContent className="text-sm text-muted-foreground leading-relaxed">
             Le travail hybride chez CTM Hub nécessite une coordination pour optimiser l'espace de bureau et favoriser les échanges en présentiel. Votre sélection aide les managers à organiser les réunions d'équipe.
           </CardContent>
         </Card>
         <Card className="border-none shadow-sm">
           <CardHeader>
             <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Calcul des Vouchers</CardTitle>
           </CardHeader>
           <CardContent className="text-sm text-muted-foreground leading-relaxed">
             Attention : Les tickets restaurant et l'indemnité de transport sont calculés sur la base de votre présence réelle enregistrée ici chaque semaine.
           </CardContent>
         </Card>
      </div>
    </div>
  );
}