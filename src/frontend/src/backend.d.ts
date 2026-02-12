import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type EscalationId = bigint;
export interface Escalation {
    customerName: string;
    escalationManager: string;
    escalationTrend: string;
    title: string;
    escalationId: EscalationId;
    referenceNumber: string;
    projectName: string;
    escalationStatus: EscalationStatus;
    createdDate: bigint;
    escalationType: string;
    businessGroup: string;
    mainContact: string;
    currentStatus: string;
    product: string;
    escalationNumber: string;
    reason: string;
    functionalArea: string;
    deEscalationCriteria: string;
}
export interface EscalationResponse {
    customerName: string;
    escalationManager: string;
    escalationTrend: string;
    title: string;
    escalationId: EscalationId;
    referenceNumber: string;
    projectName: string;
    escalationStatus: EscalationStatus;
    createdDate: bigint;
    escalationType: string;
    businessGroup: string;
    mainContact: string;
    currentStatus: string;
    lengthOfEscalation: bigint;
    product: string;
    escalationNumber: string;
    reason: string;
    functionalArea: string;
    deEscalationCriteria: string;
}
export interface UserProfile {
    name: string;
}
export enum EscalationStatus {
    Red = "Red",
    Yellow = "Yellow",
    Assessment = "Assessment",
    Green = "Green",
    Resolved = "Resolved"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEscalation(title: string, reason: string, deEscalationCriteria: string, currentStatus: string, escalationManager: string, functionalArea: string, escalationTrend: string, escalationStatus: EscalationStatus, escalationType: string, mainContact: string, customerName: string, projectName: string, referenceNumber: string, businessGroup: string, product: string): Promise<EscalationId>;
    deleteEscalation(escalationId: EscalationId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEscalation(escalationId: EscalationId): Promise<EscalationResponse>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listEscalations(): Promise<Array<EscalationResponse>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEscalation(escalationId: EscalationId, updatedEscalation: Escalation): Promise<void>;
}
