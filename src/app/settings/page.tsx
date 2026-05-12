"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Shield, Image as ImageIcon, Rocket, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("CTM Hub");

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été prises en compte avec succès.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et les paramètres de l'application.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white p-1 rounded-2xl shadow-sm mb-8 h-12">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="project" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
            <Rocket className="w-4 h-4" /> Projet
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
            <Shield className="w-4 h-4" /> Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="font-headline">Informations Personnelles</CardTitle>
              <CardDescription>Certaines informations sont en lecture seule pour des raisons de sécurité RH.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nom Complet</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email Professionnel</Label>
                  <Input defaultValue={user?.email} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Rôle (RH Uniquement)</Label>
                  <Input defaultValue={user?.role} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Département (RH Uniquement)</Label>
                  <Input defaultValue={user?.department} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Date de Naissance (Lecture Seule)</Label>
                  <Input defaultValue={user?.dob} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input defaultValue={user?.phone} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex justify-end">
               <Button onClick={handleSave} className="gap-2 bg-primary">
                 <Save className="w-4 h-4" /> Enregistrer les modifications
               </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="project" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Configuration du Projet</CardTitle>
              <CardDescription>Personnalisez l'identité de votre instance CTM Hub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label>Nom du Projet</Label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="max-w-md" />
              </div>
              
              <div className="space-y-4">
                <Label>Logo du Projet</Label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center border-2 border-dashed border-accent/20">
                     <ImageIcon className="w-8 h-8 text-accent/40" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Télécharger une image</Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG ou SVG. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary">Préférences d'Affichage</h3>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                  <div className="space-y-0.5">
                    <Label>Mode Sombre Automatique</Label>
                    <p className="text-xs text-muted-foreground">Basculer selon les réglages système.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                  <div className="space-y-0.5">
                    <Label>Animations Réduites</Label>
                    <p className="text-xs text-muted-foreground">Pour une navigation plus sobre.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex justify-end">
               <Button onClick={handleSave} className="gap-2 bg-primary">
                 <Save className="w-4 h-4" /> Sauvegarder
               </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}