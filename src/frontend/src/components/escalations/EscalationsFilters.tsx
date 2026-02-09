import type { EscalationFilters } from '../../hooks/useEscalationsFilters';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface EscalationsFiltersProps {
  filters: EscalationFilters;
  setFilters: (filters: EscalationFilters) => void;
  uniqueValues: {
    statuses: string[];
    functionalAreas: string[];
    businessGroups: string[];
  };
  onReset: () => void;
}

export default function EscalationsFilters({ filters, setFilters, uniqueValues, onReset }: EscalationsFiltersProps) {
  const handleChange = (field: keyof EscalationFilters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="escalationStatus">Escalation Status</Label>
          <Select value={filters.escalationStatus} onValueChange={(v) => handleChange('escalationStatus', v)}>
            <SelectTrigger id="escalationStatus">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {uniqueValues.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="functionalArea">Functional Area</Label>
          <Select value={filters.functionalArea} onValueChange={(v) => handleChange('functionalArea', v)}>
            <SelectTrigger id="functionalArea">
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All areas</SelectItem>
              {uniqueValues.functionalAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessGroup">Business Group</Label>
          <Select value={filters.businessGroup} onValueChange={(v) => handleChange('businessGroup', v)}>
            <SelectTrigger id="businessGroup">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All groups</SelectItem>
              {uniqueValues.businessGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={filters.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Search by customer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="escalationManager">Escalation Manager</Label>
          <Input
            id="escalationManager"
            value={filters.escalationManager}
            onChange={(e) => handleChange('escalationManager', e.target.value)}
            placeholder="Search by manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdDateFrom">Created From</Label>
          <Input
            id="createdDateFrom"
            type="date"
            value={filters.createdDateFrom}
            onChange={(e) => handleChange('createdDateFrom', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdDateTo">Created To</Label>
          <Input
            id="createdDateTo"
            type="date"
            value={filters.createdDateTo}
            onChange={(e) => handleChange('createdDateTo', e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
