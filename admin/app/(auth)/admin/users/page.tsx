import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/admin/users-table";

export default function usersDashboard() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Panel Administracyjny</h1>
          <p className="text-muted-foreground">
            Zarządzaj użytkownikami i przeglądaj statystyki systemu
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Użytkownicy</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
