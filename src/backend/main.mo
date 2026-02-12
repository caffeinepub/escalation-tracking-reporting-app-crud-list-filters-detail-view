import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import EscalationStatusHelper "escalation-status-helper";


// migration called on actor side via 'with' clause

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type EscalationStatus = EscalationStatusHelper.EscalationStatus;

  type EscalationId = Nat;
  var nextEscalationId = 0;
  let escalations = Map.empty<EscalationId, Escalation>();
  let yearSequenceCounters = Map.empty<Nat, Nat>();

  type Escalation = {
    escalationId : EscalationId;
    title : Text;
    reason : Text;
    deEscalationCriteria : Text;
    currentStatus : Text;
    escalationManager : Text;
    functionalArea : Text;
    escalationTrend : Text;
    escalationStatus : EscalationStatus;
    createdDate : Int;
    escalationType : Text;
    mainContact : Text;
    customerName : Text;
    projectName : Text;
    referenceNumber : Text;
    escalationNumber : Text;
    businessGroup : Text;
    product : Text;
  };

  public type EscalationResponse = {
    escalationId : EscalationId;
    title : Text;
    reason : Text;
    deEscalationCriteria : Text;
    currentStatus : Text;
    escalationManager : Text;
    functionalArea : Text;
    escalationTrend : Text;
    escalationStatus : EscalationStatus;
    createdDate : Int;
    escalationType : Text;
    mainContact : Text;
    customerName : Text;
    projectName : Text;
    referenceNumber : Text;
    escalationNumber : Text;
    businessGroup : Text;
    product : Text;
    lengthOfEscalation : Nat;
  };

  module Escalation {
    public func compare(a : Escalation, b : Escalation) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  func computeLengthOfEscalation(createdDate : Int) : Nat {
    let currentTime = Time.now();
    let timeDifference = currentTime - createdDate;
    let nanosecondsPerDay = 24 * 60 * 60 * 1_000_000_000;
    let days = timeDifference / nanosecondsPerDay;
    if (days < 0) { 0 } else { days.toNat() };
  };

  func generateEscalationNumber() : Text {
    let currentTime = Time.now();
    let currentYear = extractYearFromTime(currentTime);

    let sequenceNumber = switch (yearSequenceCounters.get(currentYear)) {
      case (null) {
        yearSequenceCounters.add(currentYear, 1);
        1;
      };
      case (?currentSequence) {
        let newSequence = currentSequence + 1;
        yearSequenceCounters.add(currentYear, newSequence);
        newSequence;
      };
    };

    "ESC-" # currentYear.toText() # "-" # sequenceNumber.toText();
  };

  // TODO: Integrate with Time-based year extraction once available
  func extractYearFromTime(_ : Int) : Nat {
    2024;
  };

  func validateEscalationStatus(status : EscalationStatus) {
    switch (status) {
      case (#Red or #Yellow or #Green or #Resolved or #Assessment) {};
    };
  };

  public shared ({ caller }) func createEscalation(
    title : Text,
    reason : Text,
    deEscalationCriteria : Text,
    currentStatus : Text,
    escalationManager : Text,
    functionalArea : Text,
    escalationTrend : Text,
    escalationStatus : EscalationStatus,
    escalationType : Text,
    mainContact : Text,
    customerName : Text,
    projectName : Text,
    referenceNumber : Text,
    businessGroup : Text,
    product : Text,
  ) : async EscalationId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create escalations");
    };

    validateEscalationStatus(escalationStatus);

    let escalationNumber = generateEscalationNumber();
    let escalationId = nextEscalationId;

    let newEscalation : Escalation = {
      escalationId;
      title;
      reason;
      deEscalationCriteria;
      currentStatus;
      escalationManager;
      functionalArea;
      escalationTrend;
      escalationStatus;
      createdDate = Time.now();
      escalationType;
      mainContact;
      customerName;
      projectName;
      referenceNumber;
      escalationNumber;
      businessGroup;
      product;
    };

    escalations.add(escalationId, newEscalation);
    nextEscalationId += 1;
    escalationId;
  };

  public query ({ caller }) func listEscalations() : async [EscalationResponse] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list escalations");
    };

    escalations.values().toArray().sort().map<Escalation, EscalationResponse>(
      func(escalation) {
        {
          escalation with
          lengthOfEscalation = computeLengthOfEscalation(escalation.createdDate);
        };
      }
    );
  };

  public query ({ caller }) func getEscalation(escalationId : EscalationId) : async EscalationResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get escalations");
    };

    switch (escalations.get(escalationId)) {
      case (null) { Runtime.trap("Escalation not found") };
      case (?escalation) {
        {
          escalation with
          lengthOfEscalation = computeLengthOfEscalation(escalation.createdDate);
        };
      };
    };
  };

  public shared ({ caller }) func updateEscalation(escalationId : EscalationId, updatedEscalation : Escalation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update escalations");
    };

    let existingEscalation = switch (escalations.get(escalationId)) {
      case (null) { Runtime.trap("Escalation not found") };
      case (?escalation) { escalation };
    };

    validateEscalationStatus(updatedEscalation.escalationStatus);

    let finalEscalation : Escalation = {
      updatedEscalation with
      createdDate = existingEscalation.createdDate;
      escalationId = existingEscalation.escalationId;
      escalationNumber = existingEscalation.escalationNumber;
    };

    escalations.add(escalationId, finalEscalation);
  };

  public shared ({ caller }) func deleteEscalation(escalationId : EscalationId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete escalations");
    };

    if (not escalations.containsKey(escalationId)) {
      Runtime.trap("Escalation not found");
    };

    escalations.remove(escalationId);
  };
};
