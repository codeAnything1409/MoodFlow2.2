import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo className="h-6 w-6" />
            <span className="font-bold sm:inline-block font-headline">
              Anshika
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
