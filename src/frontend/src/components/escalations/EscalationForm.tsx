import { useState, useEffect } from 'react';
import type { Escalation } from '../../backend';
import { EscalationStatus } from '../../backend';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { computeDaysSinceCreation } from '../../utils/escalationLength';

interface EscalationFormProps {
  initialData?: Escalation;
  onSubmit: (data: Escalation) => Promise<void>;
  isSubmitting: boolean;
}

export default function EscalationForm({ initialData, onSubmit, isSubmitting }: EscalationFormProps) {
  const [formData, setFormData] = useState<Escalation>({
    escalationId: BigInt(0),
    title: '',
    reason: '',
    deEscalationCriteria: '',
    currentStatus: '',
    escalationManager: '',
    functionalArea: '',
    escalationTrend: '',
    escalationStatus: EscalationStatus.Assessment,
    createdDate: BigInt(0),
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

  const handleChange = (field: keyof Escalation, value: string | EscalationStatus) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isEditMode = !!initialData;

  // Format timestamp (nanoseconds) to readable date
  const formatCreatedDate = (timestamp: bigint): string => {
    if (timestamp === BigInt(0)) return 'Not yet created';
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(timestamp / BigInt(1000000));
    return new Date(milliseconds).toLocaleString();
  };

  // Compute length of escalation display value
  const getLengthOfEscalationDisplay = (): string => {
    if (!isEditMode || formData.createdDate === BigInt(0)) {
      return 'Calculated after save';
    }
    
    const days = computeDaysSinceCreation(formData.createdDate);
    
    if (days === null) {
      return 'Not yet created';
    }
    
    return days.toString();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Escalation Title
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter escalation title"
            required
          />
        </div>

        {/* Escalation Number - Read-only */}
        <div className="space-y-2">
          <Label htmlFor="escalationNumber">Escalation Number</Label>
          {isEditMode ? (
            <Input
              id="escalationNumber"
              type="text"
              value={formData.escalationNumber}
              disabled
              className="bg-muted"
            />
          ) : (
            <Input
              id="escalationNumber"
              type="text"
              value="Auto-generated on save"
              disabled
              className="bg-muted text-muted-foreground italic"
            />
          )}
        </div>

        {/* Reference Number */}
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference Number</Label>
          <Input
            id="referenceNumber"
            type="text"
            value={formData.referenceNumber}
            onChange={(e) => handleChange('referenceNumber', e.target.value)}
            placeholder="Internal reference number"
          />
        </div>

        {/* Escalation Status - Select dropdown */}
        <div className="space-y-2">
          <Label htmlFor="escalationStatus">Escalation Status</Label>
          <Select
            value={formData.escalationStatus}
            onValueChange={(value) => handleChange('escalationStatus', value as EscalationStatus)}
          >
            <SelectTrigger id="escalationStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EscalationStatus.Red}>RED</SelectItem>
              <SelectItem value={EscalationStatus.Yellow}>YELLOW</SelectItem>
              <SelectItem value={EscalationStatus.Green}>GREEN</SelectItem>
              <SelectItem value={EscalationStatus.Assessment}>Assessment</SelectItem>
              <SelectItem value={EscalationStatus.Resolved}>Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Escalation Type - Select dropdown */}
        <div className="space-y-2">
          <Label htmlFor="escalationType">Escalation Type</Label>
          <Select
            value={formData.escalationType}
            onValueChange={(value) => handleChange('escalationType', value)}
          >
            <SelectTrigger id="escalationType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corp">Corp</SelectItem>
              <SelectItem value="Proactive">Proactive</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Customer or client name"
          />
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            type="text"
            value={formData.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="Associated project"
          />
        </div>

        {/* Business Group */}
        <div className="space-y-2">
          <Label htmlFor="businessGroup">Business Group</Label>
          <Input
            id="businessGroup"
            type="text"
            value={formData.businessGroup}
            onChange={(e) => handleChange('businessGroup', e.target.value)}
            placeholder="Business unit or group"
          />
        </div>

        {/* Functional Area */}
        <div className="space-y-2">
          <Label htmlFor="functionalArea">Functional Area</Label>
          <Input
            id="functionalArea"
            type="text"
            value={formData.functionalArea}
            onChange={(e) => handleChange('functionalArea', e.target.value)}
            placeholder="Department or functional area"
          />
        </div>

        {/* Product */}
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Input
            id="product"
            type="text"
            value={formData.product}
            onChange={(e) => handleChange('product', e.target.value)}
            placeholder="Product or service"
          />
        </div>

        {/* Escalation Manager */}
        <div className="space-y-2">
          <Label htmlFor="escalationManager">Escalation Manager</Label>
          <Input
            id="escalationManager"
            type="text"
            value={formData.escalationManager}
            onChange={(e) => handleChange('escalationManager', e.target.value)}
            placeholder="Manager responsible"
          />
        </div>

        {/* Main Contact */}
        <div className="space-y-2">
          <Label htmlFor="mainContact">Main Contact</Label>
          <Input
            id="mainContact"
            type="text"
            value={formData.mainContact}
            onChange={(e) => handleChange('mainContact', e.target.value)}
            placeholder="Primary contact person"
          />
        </div>

        {/* Escalation Trend - Select dropdown */}
        <div className="space-y-2">
          <Label htmlFor="escalationTrend">Escalation Trend</Label>
          <Select
            value={formData.escalationTrend}
            onValueChange={(value) => handleChange('escalationTrend', value)}
          >
            <SelectTrigger id="escalationTrend">
              <SelectValue placeholder="Select trend" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Up">Up</SelectItem>
              <SelectItem value="Down">Down</SelectItem>
              <SelectItem value="No Change">No Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Length of Escalation - Read-only, computed */}
        <div className="space-y-2">
          <Label htmlFor="lengthOfEscalation">Length of Escalation (days)</Label>
          <Input
            id="lengthOfEscalation"
            type="text"
            value={getLengthOfEscalationDisplay()}
            disabled
            className="bg-muted text-muted-foreground"
          />
        </div>

        {/* Created Date - Read-only, backend-generated */}
        <div className="space-y-2">
          <Label htmlFor="createdDate">Created Date</Label>
          <Input
            id="createdDate"
            type="text"
            value={formatCreatedDate(formData.createdDate)}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Escalation Reason - Textarea */}
        <div className="space-y-2">
          <Label htmlFor="reason">Escalation Reason</Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Describe the reason for escalation"
            rows={4}
          />
        </div>

        {/* Current Status - Textarea (matching Escalation Reason) */}
        <div className="space-y-2">
          <Label htmlFor="currentStatus">Current Status</Label>
          <Textarea
            id="currentStatus"
            value={formData.currentStatus}
            onChange={(e) => handleChange('currentStatus', e.target.value)}
            placeholder="Current state of escalation"
            rows={4}
          />
        </div>

        {/* De-escalation Criteria - Textarea */}
        <div className="space-y-2">
          <Label htmlFor="deEscalationCriteria">De-escalation Criteria</Label>
          <Textarea
            id="deEscalationCriteria"
            value={formData.deEscalationCriteria}
            onChange={(e) => handleChange('deEscalationCriteria', e.target.value)}
            placeholder="Criteria for resolving or de-escalating"
            rows={4}
          />
        </div>
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
