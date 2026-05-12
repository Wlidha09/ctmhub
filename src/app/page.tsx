"use client"

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LayoutDashboard, Rocket } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const { user, login } = useAuth();
  const logo = PlaceHolderImages.find(img => img.id === 'project-logo');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
          <Rocket className="w-6 h-6" />
        </div>
        <span className="text-2xl font-headline font-bold text-primary">CTM Hub</span>
      </div>

      <main className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-headline font-bold leading-tight text-primary">
            Simplifiez votre gestion <span className="text-accent">RH & Paie</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Une solution SaaS moderne conçue pour les entreprises Tunisiennes. Automatisez vos processus, de l'onboarding au calcul de la paie.
          </p>
          <div className="flex gap-4">
            {user ? (
              <Button size="lg" className="rounded-full px-8 gap-2" asChild>
                <a href="/dashboard">
                  <LayoutDashboard className="w-5 h-5" /> Accéder au Dashboard
                </a>
              </Button>
            ) : (
              <Button size="lg" className="rounded-full px-8 gap-2" onClick={login}>
                <LogIn className="w-5 h-5" /> Se connecter avec Google
              </Button>
            )}
            <Button variant="outline" size="lg" className="rounded-full px-8">
              En savoir plus
            </Button>
          </div>
        </div>

        <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
           <div className="grid grid-cols-2 gap-4 p-8">
             <Card className="bg-white/80 border-none shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
               <CardHeader className="p-4">
                 <CardTitle className="text-sm font-headline">Paie Automatisée</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                 <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-accent" />
                 </div>
               </CardContent>
             </Card>
             <Card className="bg-white/80 border-none shadow-lg transform rotate-3 hover:rotate-0 transition-transform translate-y-8">
               <CardHeader className="p-4">
                 <CardTitle className="text-sm font-headline">Vouchers AI</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                 <div className="flex gap-1">
                   {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 rounded-sm bg-primary/20" />)}
                 </div>
               </CardContent>
             </Card>
             <Card className="bg-white/80 border-none shadow-lg transform -rotate-1 hover:rotate-0 transition-transform -translate-y-4">
               <CardHeader className="p-4">
                 <CardTitle className="text-sm font-headline">Congés</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                 <p className="text-xs font-bold text-accent">98% Validés</p>
               </CardContent>
             </Card>
           </div>
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © 2025 CTM Hub. Tous droits réservés.
      </footer>
    </div>
  );
}