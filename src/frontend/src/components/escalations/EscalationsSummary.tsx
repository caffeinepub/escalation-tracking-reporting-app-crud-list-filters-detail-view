import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EscalationsSummaryProps {
  summaries: {
    byStatus: Record<string, number>;
    byFunctionalArea: Record<string, number>;
    byBusinessGroup: Record<string, number>;
  };
  totalCount: number;
}

export default function EscalationsSummary({ summaries, totalCount }: EscalationsSummaryProps) {
  const renderSummaryGroup = (title: string, data: Record<string, number>) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center py-4">No data available</div>
      );
    }

    return (
      <div className="space-y-2">
        {entries.map(([key, count]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm truncate flex-1">{key || 'Unspecified'}</span>
            <Badge variant="secondary" className="ml-2">
              {count}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Status</CardTitle>
        </CardHeader>
        <CardContent>{renderSummaryGroup('Status', summaries.byStatus)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Functional Area</CardTitle>
        </CardHeader>
        <CardContent>{renderSummaryGroup('Functional Area', summaries.byFunctionalArea)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Business Group</CardTitle>
        </CardHeader>
        <CardContent>{renderSummaryGroup('Business Group', summaries.byBusinessGroup)}</CardContent>
      </Card>
    </div>
  );
}
