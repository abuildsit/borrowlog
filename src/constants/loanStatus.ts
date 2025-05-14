// Status Codes - these numeric values are what's stored in the database
export enum LoanStatus {
  ACTIVE = 1,
  OVERDUE = 2,
  RETURNED = 3
}

// Display labels - completely separate from enum names
export const statusLabels: Record<number, string> = {
  [LoanStatus.ACTIVE]: 'Active',
  [LoanStatus.OVERDUE]: 'Overdue',
  [LoanStatus.RETURNED]: 'Returned'
};

export const getLoanStatusLabel = (status: number): string => {
  return statusLabels[status] || 'Unknown';
};

export const getLoanStatusValue = (label: string): number | undefined => {
  const entry = Object.entries(statusLabels).find(([_, value]) => value === label);
  return entry ? Number(entry[0]) : undefined;
};

export const ALL_STATUS_CODES = Object.values(LoanStatus).filter(
  value => typeof value === 'number'
) as number[];

export default LoanStatus; 