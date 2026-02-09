import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogOut } from 'lucide-react';

interface AuthBootstrapErrorViewProps {
  error?: Error;
}

export default function AuthBootstrapErrorView({ error }: AuthBootstrapErrorViewProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const errorMessage = error?.message || 'An unexpected error occurred';
  const isUnauthorized = errorMessage.toLowerCase().includes('unauthorized');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Initialization Failed</CardTitle>
          <CardDescription>
            {isUnauthorized
              ? 'Your account does not have access to this application.'
              : 'We encountered a problem loading your profile.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="break-words">
              {errorMessage}
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Please log out and try signing in again. If the problem persists, contact support.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full" size="lg">
              <LogOut className="h-5 w-5 mr-2" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
