import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const handleLogin = () => {
    try {
      login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';
  const hasError = loginStatus === 'loginError';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Escalation Tracker</CardTitle>
          <CardDescription className="text-base">
            Track and manage escalations with ease. Sign in to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sign in failed</AlertTitle>
              <AlertDescription>
                {loginError?.message || 'An error occurred during sign in. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full" size="lg">
            <LogIn className="h-5 w-5 mr-2" />
            {isLoggingIn ? 'Signing in...' : hasError ? 'Try again' : 'Sign in with Internet Identity'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Internet Computer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
