import type { EscalationFilters } from '../../hooks/useEscalationsFilters';
import { EscalationStatus } from '../../backend';
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

// Sentinel values for "All" options (must be non-empty strings)
const ALL_STATUSES_SENTINEL = '__all_statuses__';
const ALL_AREAS_SENTINEL = '__all_areas__';
const ALL_GROUPS_SENTINEL = '__all_groups__';

export default function EscalationsFilters({ filters, setFilters, uniqueValues, onReset }: EscalationsFiltersProps) {
  const handleChange = (field: keyof EscalationFilters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSelectChange = (field: keyof EscalationFilters, value: string, sentinel: string) => {
    // If the sentinel "All" option is selected, set the filter to empty string
    // so the Select shows its placeholder
    const actualValue = value === sentinel ? '' : value;
    handleChange(field, actualValue);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  // Map status enum values to display labels
  const getStatusLabel = (status: string) => {
    switch (status) {
      case EscalationStatus.Red:
        return 'RED';
      case EscalationStatus.Yellow:
        return 'YELLOW';
      case EscalationStatus.Green:
        return 'GREEN';
      case EscalationStatus.Assessment:
        return 'Assessment';
      case EscalationStatus.Resolved:
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="escalationStatus">Escalation Status</Label>
          <Select
            value={filters.escalationStatus || ALL_STATUSES_SENTINEL}
            onValueChange={(v) => handleSelectChange('escalationStatus', v, ALL_STATUSES_SENTINEL)}
          >
            <SelectTrigger id="escalationStatus">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES_SENTINEL}>All statuses</SelectItem>
              {uniqueValues.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="functionalArea">Functional Area</Label>
          <Select
            value={filters.functionalArea || ALL_AREAS_SENTINEL}
            onValueChange={(v) => handleSelectChange('functionalArea', v, ALL_AREAS_SENTINEL)}
          >
            <SelectTrigger id="functionalArea">
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_AREAS_SENTINEL}>All areas</SelectItem>
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
          <Select
            value={filters.businessGroup || ALL_GROUPS_SENTINEL}
            onValueChange={(v) => handleSelectChange('businessGroup', v, ALL_GROUPS_SENTINEL)}
          >
            <SelectTrigger id="businessGroup">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_GROUPS_SENTINEL}>All groups</SelectItem>
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
            type="text"
            value={filters.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Search by customer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="escalationManager">Escalation Manager</Label>
          <Input
            id="escalationManager"
            type="text"
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
