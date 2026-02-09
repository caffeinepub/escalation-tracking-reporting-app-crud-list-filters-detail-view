import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppShell from './components/AppShell';
import EscalationsListPage from './pages/EscalationsListPage';
import EscalationDetailPage from './pages/EscalationDetailPage';
import EscalationCreatePage from './pages/EscalationCreatePage';
import EscalationEditPage from './pages/EscalationEditPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import AuthBootstrapErrorView from './components/AuthBootstrapErrorView';

// Root layout component
function RootLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, error } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handle authenticated bootstrap errors (e.g., getCallerUserProfile failures)
  if (error && isAuthenticated) {
    return <AuthBootstrapErrorView error={error as Error} />;
  }

  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// List route (default)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: EscalationsListPage,
});

// Detail route
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/escalation/$escalationId',
  component: EscalationDetailPage,
});

// Create route
const createRoute_ = createRoute({
  getParentRoute: () => rootRoute,
  path: '/escalation/new',
  component: EscalationCreatePage,
});

// Edit route
const editRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/escalation/$escalationId/edit',
  component: EscalationEditPage,
});

const routeTree = rootRoute.addChildren([indexRoute, detailRoute, createRoute_, editRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
