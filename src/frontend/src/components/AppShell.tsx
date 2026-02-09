import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Home } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleHome = () => {
    navigate({ to: '/' });
  };

  const handleCreate = () => {
    navigate({ to: '/escalation/new' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-foreground">Escalation Tracker</h1>
              <nav className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="default" size="sm" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Escalation
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {userProfile && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, <span className="font-medium text-foreground">{userProfile.name}</span>
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <nav className="flex md:hidden items-center gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={handleHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="default" size="sm" onClick={handleCreate} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Escalation Tracker. All rights reserved.</p>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
