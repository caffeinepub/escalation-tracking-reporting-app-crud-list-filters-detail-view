import { useMemo, useState } from 'react';
import type { Escalation } from '../backend';

export interface EscalationFilters {
  escalationStatus: string;
  customerName: string;
  escalationManager: string;
  functionalArea: string;
  businessGroup: string;
  createdDateFrom: string;
  createdDateTo: string;
}

export const emptyFilters: EscalationFilters = {
  escalationStatus: '',
  customerName: '',
  escalationManager: '',
  functionalArea: '',
  businessGroup: '',
  createdDateFrom: '',
  createdDateTo: '',
};

export function useEscalationsFilters(escalations: Array<Escalation & { id: bigint }>) {
  const [filters, setFilters] = useState<EscalationFilters>(emptyFilters);

  const filteredEscalations = useMemo(() => {
    return escalations.filter((esc) => {
      if (filters.escalationStatus && esc.escalationStatus !== filters.escalationStatus) return false;
      if (filters.customerName && !esc.customerName.toLowerCase().includes(filters.customerName.toLowerCase()))
        return false;
      if (
        filters.escalationManager &&
        !esc.escalationManager.toLowerCase().includes(filters.escalationManager.toLowerCase())
      )
        return false;
      if (filters.functionalArea && esc.functionalArea !== filters.functionalArea) return false;
      if (filters.businessGroup && esc.businessGroup !== filters.businessGroup) return false;

      // Date range filtering
      if (filters.createdDateFrom || filters.createdDateTo) {
        const escDate = new Date(esc.createdDate);
        if (filters.createdDateFrom && escDate < new Date(filters.createdDateFrom)) return false;
        if (filters.createdDateTo && escDate > new Date(filters.createdDateTo)) return false;
      }

      return true;
    });
  }, [escalations, filters]);

  const summaries = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const byFunctionalArea: Record<string, number> = {};
    const byBusinessGroup: Record<string, number> = {};

    filteredEscalations.forEach((esc) => {
      byStatus[esc.escalationStatus] = (byStatus[esc.escalationStatus] || 0) + 1;
      byFunctionalArea[esc.functionalArea] = (byFunctionalArea[esc.functionalArea] || 0) + 1;
      byBusinessGroup[esc.businessGroup] = (byBusinessGroup[esc.businessGroup] || 0) + 1;
    });

    return { byStatus, byFunctionalArea, byBusinessGroup };
  }, [filteredEscalations]);

  const uniqueValues = useMemo(() => {
    const statuses = new Set<string>();
    const functionalAreas = new Set<string>();
    const businessGroups = new Set<string>();

    escalations.forEach((esc) => {
      if (esc.escalationStatus) statuses.add(esc.escalationStatus);
      if (esc.functionalArea) functionalAreas.add(esc.functionalArea);
      if (esc.businessGroup) businessGroups.add(esc.businessGroup);
    });

    return {
      statuses: Array.from(statuses).sort(),
      functionalAreas: Array.from(functionalAreas).sort(),
      businessGroups: Array.from(businessGroups).sort(),
    };
  }, [escalations]);

  return {
    filters,
    setFilters,
    filteredEscalations,
    summaries,
    uniqueValues,
    resetFilters: () => setFilters(emptyFilters),
  };
}
