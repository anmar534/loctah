import CategoryCard from './CategoryCard';

const mockCategories = [
  { slug: 'electronics', name: 'Electronics', description: 'Phones, laptops and more.' },
  { slug: 'home', name: 'Home & Living', description: 'Furniture, appliances and decor.' },
  { slug: 'beauty', name: 'Beauty', description: 'Skin care and cosmetics.' },
];

export default function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockCategories.map((category) => (
        <CategoryCard key={category.slug} {...category} />
      ))}
    </div>
  );
}
