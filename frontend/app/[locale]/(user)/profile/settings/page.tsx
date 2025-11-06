export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-slate-600">Manage notifications, privacy and account preferences.</p>
      </header>
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
        Add settings controls here.
      </div>
    </div>
  );
}
