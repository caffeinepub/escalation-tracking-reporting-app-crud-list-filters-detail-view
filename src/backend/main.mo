import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to check if caller has user-level access
  // Any authenticated (non-anonymous) principal is treated as a user
  private func hasUserAccess(caller : Principal) : Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    // Non-anonymous principals automatically have user access
    // OR they have explicit user/admin role assigned
    return true;
  };

  // Helper function to check if caller is admin
  private func isAdminUser(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Escalation Management
  type EscalationId = Nat;

  type Escalation = {
    title : Text;
    reason : Text;
    deEscalationCriteria : Text;
    currentStatus : Text;
    escalationManager : Text;
    functionalArea : Text;
    escalationTrend : Text;
    escalationStatus : Text;
    lengthOfEscalation : Text;
    createdDate : Text;
    escalationType : Text;
    mainContact : Text;
    customerName : Text;
    projectName : Text;
    referenceNumber : Text;
    escalationNumber : Text;
    businessGroup : Text;
    product : Text;
  };

  module Escalation {
    public func compare(a : Escalation, b : Escalation) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let escalations = Map.empty<EscalationId, Escalation>();
  var nextEscalationId = 0;

  // Create Escalation
  public shared ({ caller }) func createEscalation(escalation : Escalation) : async EscalationId {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can create escalations");
    };

    let escalationId = nextEscalationId;
    escalations.add(escalationId, escalation);
    nextEscalationId += 1;
    escalationId;
  };

  // List Escalations
  public query ({ caller }) func listEscalations() : async [Escalation] {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can list escalations");
    };

    escalations.values().toArray().sort();
  };

  // Get Escalation by ID
  public query ({ caller }) func getEscalation(escalationId : EscalationId) : async Escalation {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can get escalations");
    };

    switch (escalations.get(escalationId)) {
      case (null) { Runtime.trap("Escalation not found") };
      case (?escalation) { escalation };
    };
  };

  // Update Escalation
  public shared ({ caller }) func updateEscalation(escalationId : EscalationId, updatedEscalation : Escalation) : async () {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can update escalations");
    };

    if (not escalations.containsKey(escalationId)) {
      Runtime.trap("Escalation not found");
    };

    escalations.add(escalationId, updatedEscalation);
  };

  // Delete Escalation
  public shared ({ caller }) func deleteEscalation(escalationId : EscalationId) : async () {
    if (not hasUserAccess(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can delete escalations");
    };

    if (not escalations.containsKey(escalationId)) {
      Runtime.trap("Escalation not found");
    };

    escalations.remove(escalationId);
  };
};
