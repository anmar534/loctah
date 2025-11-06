import ProfileForm from '@/components/forms/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-slate-600">Update your personal details and preferences.</p>
      </header>
      <ProfileForm />
    </div>
  );
}
