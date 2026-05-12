"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Phone, Mail, Building2 } from "lucide-react";
import { UserProfile } from "../lib/roles";

const MOCK_STAFF: UserProfile[] = [
  { id: '1', name: 'John Doe', email: 'john@ctm.tn', role: 'Owner', department: 'Direction', avatarUrl: '', dob: '', phone: '22333444', officeDaysPerWeek: 3, onboardingCompleted: true },
  { id: '2', name: 'Sami Ben Salem', email: 'sami@ctm.tn', role: 'Manager', department: 'IT', avatarUrl: '', dob: '', phone: '55444333', officeDaysPerWeek: 4, onboardingCompleted: true },
  { id: '3', name: 'Amira Khadraoui', email: 'amira@ctm.tn', role: 'Employee', department: 'RH', avatarUrl: '', dob: '', phone: '99888777', officeDaysPerWeek: 2, onboardingCompleted: true },
  { id: '4', name: 'Stealth Dev', email: 'dev@ctm.tn', role: 'Dev', department: 'IT', avatarUrl: '', dob: '', phone: '00000000', officeDaysPerWeek: 5, onboardingCompleted: true },
  { id: '5', name: 'Youssef Jbali', email: 'youssef@ctm.tn', role: 'Employee', department: 'Finance', avatarUrl: '', dob: '', phone: '44555666', officeDaysPerWeek: 3, onboardingCompleted: true },
];

export default function EmployeesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Logic: Exclude 'Dev' role for anyone who isn't a Dev or Owner
  const filteredStaff = MOCK_STAFF.filter(staff => {
    const isDev = staff.role === 'Dev';
    const canSeeDev = user?.role === 'Dev' || user?.role === 'Owner';
    
    if (isDev && !canSeeDev) return false;

    const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase()) || 
                         staff.department.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Annuaire du Staff</h1>
        <p className="text-muted-foreground">Consultez la liste de vos collaborateurs.</p>
      </div>

      <div className="flex gap-4 items-center max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 h-11 rounded-xl bg-white border-none shadow-sm" 
            placeholder="Rechercher par nom ou département..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="h-11 px-4 rounded-xl cursor-pointer hover:bg-muted transition-colors gap-2">
          <Filter className="w-4 h-4" /> Filtres
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden">
            <CardContent className="p-0">
              <div className="h-24 bg-gradient-to-r from-primary to-accent" />
              <div className="px-6 pb-6 -translate-y-10">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg mb-4">
                  <AvatarImage src={staff.avatarUrl} />
                  <AvatarFallback className="text-xl bg-accent text-white">{staff.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{staff.name}</h3>
                    <Badge className="bg-accent/10 text-accent border-none">{staff.role}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" /> {staff.department}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t flex justify-between">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-4">{staff.officeDaysPerWeek}j bureau</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}