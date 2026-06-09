import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shotwot/AppShell";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  return (
    <AppShell breadcrumb={["Settings"]}>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold text-navy">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your ShotWot Studio workspace.</p>
        <div className="mt-8 bg-white border border-border rounded-2xl p-8 text-muted-foreground">
          Workspace, billing and team controls live here.
        </div>
      </div>
    </AppShell>
  );
}
