import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEscalation, useDeleteEscalation } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DeleteEscalationDialog from '../components/escalations/DeleteEscalationDialog';
import { useState } from 'react';

export default function EscalationDetailPage() {
  const { escalationId } = useParams({ from: '/escalation/$escalationId' });
  const navigate = useNavigate();
  const { data: escalation, isLoading, error } = useGetEscalation(BigInt(escalationId));
  const deleteEscalation = useDeleteEscalation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate({ to: '/escalation/$escalationId/edit', params: { escalationId } });
  };

  const handleDelete = async () => {
    await deleteEscalation.mutateAsync(BigInt(escalationId));
    navigate({ to: '/' });
  };

  const handleBack = () => {
    navigate({ to: '/' });
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
        <Button variant="ghost" onClick={handleBack}>
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

  const fields = [
    { label: 'Escalation Title', value: escalation.title },
    { label: 'Escalation Number', value: escalation.escalationNumber },
    { label: 'Reference Number', value: escalation.referenceNumber },
    { label: 'Escalation Status', value: escalation.escalationStatus, badge: true },
    { label: 'Current Status', value: escalation.currentStatus },
    { label: 'Escalation Type', value: escalation.escalationType },
    { label: 'Customer Name', value: escalation.customerName },
    { label: 'Project Name', value: escalation.projectName },
    { label: 'Business Group', value: escalation.businessGroup },
    { label: 'Functional Area', value: escalation.functionalArea },
    { label: 'Product', value: escalation.product },
    { label: 'Escalation Manager', value: escalation.escalationManager },
    { label: 'Main Contact', value: escalation.mainContact },
    { label: 'Escalation Trend', value: escalation.escalationTrend },
    { label: 'Length of Escalation', value: escalation.lengthOfEscalation },
    { label: 'Created Date', value: new Date(escalation.createdDate).toLocaleDateString() },
    { label: 'Escalation Reason', value: escalation.reason, fullWidth: true },
    { label: 'De-escalation Criteria', value: escalation.deEscalationCriteria, fullWidth: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{escalation.title}</CardTitle>
              <CardDescription>Escalation #{escalation.escalationNumber}</CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              {escalation.escalationStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields
              .filter((f) => !f.fullWidth)
              .map((field) => (
                <div key={field.label} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                  {field.badge ? (
                    <Badge variant="secondary">{field.value || 'N/A'}</Badge>
                  ) : (
                    <p className="text-base">{field.value || 'N/A'}</p>
                  )}
                </div>
              ))}
          </div>

          <Separator />

          {fields
            .filter((f) => f.fullWidth)
            .map((field) => (
              <div key={field.label} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                <p className="text-base whitespace-pre-wrap">{field.value || 'N/A'}</p>
              </div>
            ))}
        </CardContent>
      </Card>

      <DeleteEscalationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        escalationTitle={escalation.title}
        isDeleting={deleteEscalation.isPending}
      />
    </div>
  );
}
