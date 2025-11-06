import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </header>
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
        {t('placeholder')}
      </div>
    </div>
  );
}
