import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Escalation } from '../../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye } from 'lucide-react';

interface EscalationsTableProps {
  escalations: Array<Escalation & { id: bigint }>;
}

type SortField = 'title' | 'customerName' | 'escalationStatus' | 'createdDate' | 'escalationNumber';
type SortDirection = 'asc' | 'desc';

export default function EscalationsTable({ escalations }: EscalationsTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedEscalations = useMemo(() => {
    return [...escalations].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'customerName':
          aVal = a.customerName.toLowerCase();
          bVal = b.customerName.toLowerCase();
          break;
        case 'escalationStatus':
          aVal = a.escalationStatus.toLowerCase();
          bVal = b.escalationStatus.toLowerCase();
          break;
        case 'createdDate':
          aVal = new Date(a.createdDate).getTime();
          bVal = new Date(b.createdDate).getTime();
          break;
        case 'escalationNumber':
          aVal = a.escalationNumber.toLowerCase();
          bVal = b.escalationNumber.toLowerCase();
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [escalations, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleView = (id: bigint) => {
    navigate({ to: '/escalation/$escalationId', params: { escalationId: id.toString() } });
  };

  if (escalations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No escalations found. Create your first escalation to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('escalationNumber')} className="h-8 px-2">
                Escalation #
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('title')} className="h-8 px-2">
                Title
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('customerName')} className="h-8 px-2">
                Customer
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Project</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('escalationStatus')} className="h-8 px-2">
                Status
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden lg:table-cell">Manager</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('createdDate')} className="h-8 px-2">
                Created
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEscalations.map((escalation) => (
            <TableRow key={escalation.id.toString()} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-mono text-sm">{escalation.escalationNumber}</TableCell>
              <TableCell className="font-medium max-w-xs truncate">{escalation.title}</TableCell>
              <TableCell className="max-w-xs truncate">{escalation.customerName}</TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">{escalation.projectName}</TableCell>
              <TableCell>
                <Badge variant="secondary">{escalation.escalationStatus}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{escalation.escalationManager}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(escalation.createdDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleView(escalation.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
