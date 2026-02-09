import { useNavigate } from '@tanstack/react-router';
import { useCreateEscalation } from '../hooks/useQueries';
import EscalationForm from '../components/escalations/EscalationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Escalation } from '../backend';

export default function EscalationCreatePage() {
  const navigate = useNavigate();
  const createEscalation = useCreateEscalation();

  const handleSubmit = async (data: Escalation) => {
    await createEscalation.mutateAsync(data);
    navigate({ to: '/' });
  };

  const handleBack = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Escalation</CardTitle>
          <CardDescription>Fill in the details below to create a new escalation record</CardDescription>
        </CardHeader>
        <CardContent>
          <EscalationForm onSubmit={handleSubmit} isSubmitting={createEscalation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
