import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-base-200 p-6 text-center">
      <div>
        <ChefHat className="mx-auto text-brand-300" size={100} />
        <b className="mt-3 block text-8xl text-brand-600">404</b>
        <h1 className="mt-4 text-3xl font-bold">This recipe got away.</h1>
        <p className="mt-3 text-base-content/60">The page you're looking for isn't on today's menu.</p>
        <Link className="btn-brand mt-8" href="/">
          Back Home
        </Link>
      </div>
    </div>
  );
}
