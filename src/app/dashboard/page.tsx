"use client"

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CalendarClock, 
  Building2, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const isEmployee = user.role === 'Employee';
  const isManager = user.role === 'Manager';
  const isHR = ['HR', 'Owner', 'Dev'].includes(user.role);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Tableau de Bord</h1>
          <p className="text-muted-foreground">Bonjour {user.name}, voici le résumé de votre activité.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1 rounded-full">{user.department}</Badge>
          <Badge variant="outline" className="px-3 py-1 rounded-full capitalize">{user.role}</Badge>
        </div>
      </div>

      {/* KPI Cards for HR/Owner */}
      {isHR && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Effectif Actif', value: '42', icon: Users, color: 'text-primary' },
            { label: 'En Congé', value: '4', icon: CalendarClock, color: 'text-orange-500' },
            { label: 'Départements', value: '7', icon: Building2, color: 'text-accent' },
            { label: 'Validations', value: '12', icon: CheckCircle2, color: 'text-blue-500' },
          ].map((kpi, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">+2 ce mois-ci</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Employee Widgets */}
          {isEmployee && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary/90 text-white">
                <CardHeader>
                  <CardTitle className="font-headline">Solde Congés</CardTitle>
                  <CardDescription className="text-white/70">Année en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">18.5 Jours</div>
                  <Button variant="secondary" className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white border-none">
                    Demander un congé
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline">Présence Bureau</CardTitle>
                  <CardDescription>Semaine actuelle</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">3/5</div>
                    <p className="text-sm text-muted-foreground">Jours sélectionnés</p>
                  </div>
                  <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90">
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* HR Pending Tasks */}
          {isHR && (
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Congés en Attente</CardTitle>
                  <CardDescription>Demandes nécessitant votre validation RH.</CardDescription>
                </div>
                <Button variant="outline" size="sm">Voir tout</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sami Ben Salem', type: 'Annuel', duration: '3 jours', date: '25 Mai 2025' },
                    { name: 'Amira Khadraoui', type: 'Maladie', duration: '1 jour', date: 'Hier' },
                    { name: 'Youssef Jbali', type: 'Annuel', duration: '10 jours', date: '15 Juin 2025' },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                          {req.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{req.name}</p>
                          <p className="text-xs text-muted-foreground">{req.type} • {req.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{req.date}</p>
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500">Rejeter</Button>
                          <Button size="sm" className="h-7 text-xs bg-primary">Valider</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manager Team Overview */}
          {isManager && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="font-headline">Aperçu de l'Équipe</CardTitle>
                <CardDescription>Présence de vos collaborateurs aujourd'hui.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { name: 'Alice', status: 'Bureau' },
                     { name: 'Bob', status: 'Remote' },
                     { name: 'Charlie', status: 'Congé' },
                     { name: 'Diana', status: 'Bureau' },
                   ].map((m, i) => (
                     <div key={i} className="p-3 border rounded-xl text-center">
                        <div className="w-10 h-10 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <p className="text-xs font-bold">{m.name}</p>
                        <Badge variant="outline" className="text-[10px] h-4 mt-1">{m.status}</Badge>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
           <Card className="border-none shadow-sm overflow-hidden">
             <div className="h-2 bg-accent" />
             <CardHeader>
               <CardTitle className="text-lg font-headline">Dernière Paie</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-xl">
                 <FileText className="w-8 h-8 text-accent" />
                 <div>
                   <p className="text-sm font-bold">Fiche de paie - Avril 2025</p>
                   <p className="text-xs text-muted-foreground">Générée le 01/05/2025</p>
                 </div>
               </div>
               <Button variant="outline" className="w-full gap-2">
                 <ArrowUpRight className="w-4 h-4" /> Voir le détail
               </Button>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
             <CardHeader>
               <CardTitle className="text-lg font-headline">Activité Récente</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                {[
                  { icon: Clock, text: "Onboarding complété", time: "2h ago" },
                  { icon: CheckCircle2, text: "Congé annuel validé", time: "Hier" },
                  { icon: TrendingUp, text: "Salaire viré", time: "3j ago" },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <act.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{act.text}</p>
                      <p className="text-xs text-muted-foreground">{act.time}</p>
                    </div>
                  </div>
                ))}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}