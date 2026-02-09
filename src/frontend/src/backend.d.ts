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
    referenceNumber: string;
    projectName: string;
    escalationStatus: string;
    createdDate: string;
    escalationType: string;
    businessGroup: string;
    mainContact: string;
    currentStatus: string;
    lengthOfEscalation: string;
    product: string;
    escalationNumber: string;
    reason: string;
    functionalArea: string;
    deEscalationCriteria: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEscalation(escalation: Escalation): Promise<EscalationId>;
    deleteEscalation(escalationId: EscalationId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEscalation(escalationId: EscalationId): Promise<Escalation>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listEscalations(): Promise<Array<Escalation>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEscalation(escalationId: EscalationId, updatedEscalation: Escalation): Promise<void>;
}
