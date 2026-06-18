import { Logo } from './logo';

export function SiteFooter() {
  const footerGroups = [
    { heading: 'Quick Links', items: ['Home', 'Browse Recipes', 'About Us', 'Pricing'] },
    { heading: 'For Members', items: ['Register', 'Login', 'Premium', 'Dashboard'] },
    { heading: 'Contact', items: ['hello@recipehub.com', '+1 (555) 123-4567', '123 Food Street'] },
  ];

  return (
    <footer className="bg-[#073421] text-white">
      <div className="shell grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            A polished home for food lovers to discover, share, save, and sell memorable recipes.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.heading}>
            <h3 className="font-bold">{group.heading}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© 2026 RecipeHub. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service · Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
