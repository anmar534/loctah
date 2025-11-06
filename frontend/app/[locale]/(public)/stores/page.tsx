import StoresMap from '@/components/stores/StoresMap';
import StoresList from '@/components/stores/StoresList';

export default function StoresPage() {
  return (
    <main>
      <h1 className="sr-only">Stores</h1>
      <div className="mx-auto grid w-full max-w-6xl gap-8 py-10 lg:grid-cols-[2fr_1fr]">
        <StoresMap />
        <StoresList />
      </div>
    </main>
  );
}
