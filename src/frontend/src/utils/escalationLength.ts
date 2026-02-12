/**
 * Compute the number of full days since a given createdDate timestamp.
 * @param createdDate - Timestamp in nanoseconds (bigint)
 * @returns Number of full days elapsed, or null if createdDate is invalid/zero
 */
export function computeDaysSinceCreation(createdDate: bigint): number | null {
  if (createdDate === BigInt(0)) {
    return null;
  }

  try {
    const currentTime = Date.now(); // milliseconds
    const createdTime = Number(createdDate / BigInt(1_000_000)); // convert nanoseconds to milliseconds
    
    if (createdTime <= 0 || createdTime > currentTime) {
      return null;
    }

    const timeDifference = currentTime - createdTime;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor(timeDifference / millisecondsPerDay);
    
    return days >= 0 ? days : 0;
  } catch {
    return null;
  }
}

/**
 * Format the length of escalation for display.
 * @param createdDate - Timestamp in nanoseconds (bigint)
 * @returns Formatted string for display
 */
export function formatEscalationLength(createdDate: bigint): string {
  const days = computeDaysSinceCreation(createdDate);
  
  if (days === null) {
    return 'Not yet created';
  }
  
  if (days === 0) {
    return '0 days';
  }
  
  if (days === 1) {
    return '1 day';
  }
  
  return `${days} days`;
}
