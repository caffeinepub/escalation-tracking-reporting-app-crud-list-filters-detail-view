import { useListEscalations } from '../hooks/useQueries';
import { useEscalationsFilters } from '../hooks/useEscalationsFilters';
import EscalationsTable from '../components/escalations/EscalationsTable';
import EscalationsFilters from '../components/escalations/EscalationsFilters';
import EscalationsSummary from '../components/escalations/EscalationsSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EscalationsListPage() {
  const { data: escalations = [], isLoading, error } = useListEscalations();
  const { filters, setFilters, filteredEscalations, summaries, uniqueValues, resetFilters } =
    useEscalationsFilters(escalations);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load escalations. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Escalations Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Manage and track all escalations in one place. {escalations.length} total escalation
          {escalations.length !== 1 ? 's' : ''}.
        </p>
      </div>

      <EscalationsSummary summaries={summaries} totalCount={filteredEscalations.length} />

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your escalation list using the filters below</CardDescription>
        </CardHeader>
        <CardContent>
          <EscalationsFilters
            filters={filters}
            setFilters={setFilters}
            uniqueValues={uniqueValues}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Escalations</CardTitle>
          <CardDescription>
            {filteredEscalations.length} escalation{filteredEscalations.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EscalationsTable escalations={filteredEscalations} />
        </CardContent>
      </Card>
    </div>
  );
}
