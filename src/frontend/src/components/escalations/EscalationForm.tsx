import { useState, useEffect } from 'react';
import type { Escalation } from '../../backend';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface EscalationFormProps {
  initialData?: Escalation;
  onSubmit: (data: Escalation) => Promise<void>;
  isSubmitting: boolean;
}

export default function EscalationForm({ initialData, onSubmit, isSubmitting }: EscalationFormProps) {
  const [formData, setFormData] = useState<Escalation>({
    title: '',
    reason: '',
    deEscalationCriteria: '',
    currentStatus: '',
    escalationManager: '',
    functionalArea: '',
    escalationTrend: '',
    escalationStatus: '',
    lengthOfEscalation: '',
    createdDate: new Date().toISOString(),
    escalationType: '',
    mainContact: '',
    customerName: '',
    projectName: '',
    referenceNumber: '',
    escalationNumber: '',
    businessGroup: '',
    product: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Escalation, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const fields: Array<{
    name: keyof Escalation;
    label: string;
    type?: 'text' | 'textarea' | 'date';
    required?: boolean;
    placeholder?: string;
  }> = [
    { name: 'title', label: 'Escalation Title', required: true, placeholder: 'Enter escalation title' },
    {
      name: 'escalationNumber',
      label: 'Escalation Number',
      required: true,
      placeholder: 'e.g., ESC-2026-001',
    },
    { name: 'referenceNumber', label: 'Reference Number', placeholder: 'Internal reference number' },
    { name: 'escalationStatus', label: 'Escalation Status', placeholder: 'e.g., Open, In Progress, Closed' },
    { name: 'currentStatus', label: 'Current Status', placeholder: 'Current state of escalation' },
    { name: 'escalationType', label: 'Escalation Type', placeholder: 'Type or category' },
    { name: 'customerName', label: 'Customer Name', placeholder: 'Customer or client name' },
    { name: 'projectName', label: 'Project Name', placeholder: 'Associated project' },
    { name: 'businessGroup', label: 'Business Group', placeholder: 'Business unit or group' },
    { name: 'functionalArea', label: 'Functional Area', placeholder: 'Department or functional area' },
    { name: 'product', label: 'Product', placeholder: 'Product or service' },
    { name: 'escalationManager', label: 'Escalation Manager', placeholder: 'Manager responsible' },
    { name: 'mainContact', label: 'Main Contact', placeholder: 'Primary contact person' },
    { name: 'escalationTrend', label: 'Escalation Trend', placeholder: 'Trend or pattern' },
    { name: 'lengthOfEscalation', label: 'Length of Escalation', placeholder: 'Duration or timeframe' },
    { name: 'createdDate', label: 'Created Date', type: 'date' },
    {
      name: 'reason',
      label: 'Escalation Reason',
      type: 'textarea',
      placeholder: 'Describe the reason for escalation',
    },
    {
      name: 'deEscalationCriteria',
      label: 'De-escalation Criteria',
      type: 'textarea',
      placeholder: 'Criteria for resolving or de-escalating',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields
          .filter((f) => f.type !== 'textarea')
          .map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Input
                id={field.name}
                type={field.type === 'date' ? 'date' : 'text'}
                value={
                  field.type === 'date'
                    ? formData[field.name].split('T')[0]
                    : formData[field.name]
                }
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.type === 'date' ? new Date(e.target.value).toISOString() : e.target.value
                  )
                }
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}
      </div>

      <div className="space-y-6">
        {fields
          .filter((f) => f.type === 'textarea')
          .map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Textarea
                id={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
              />
            </div>
          ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Escalation'}
        </Button>
      </div>
    </form>
  );
}
