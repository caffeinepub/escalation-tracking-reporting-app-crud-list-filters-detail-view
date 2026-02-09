import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEscalation, useUpdateEscalation } from '../hooks/useQueries';
import EscalationForm from '../components/escalations/EscalationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Escalation } from '../backend';

export default function EscalationEditPage() {
  const { escalationId } = useParams({ from: '/escalation/$escalationId/edit' });
  const navigate = useNavigate();
  const { data: escalation, isLoading, error } = useGetEscalation(BigInt(escalationId));
  const updateEscalation = useUpdateEscalation();

  const handleSubmit = async (data: Escalation) => {
    await updateEscalation.mutateAsync({ escalationId: BigInt(escalationId), escalation: data });
    navigate({ to: '/escalation/$escalationId', params: { escalationId } });
  };

  const handleBack = () => {
    navigate({ to: '/escalation/$escalationId', params: { escalationId } });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !escalation) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Escalation not found or failed to load.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Detail
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Escalation</CardTitle>
          <CardDescription>Update the escalation details below</CardDescription>
        </CardHeader>
        <CardContent>
          <EscalationForm
            initialData={escalation}
            onSubmit={handleSubmit}
            isSubmitting={updateEscalation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
