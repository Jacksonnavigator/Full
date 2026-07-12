export type ReportPriority = 'urgent' | 'moderate' | 'low';

export interface PriorityOption {
  value: ReportPriority;
  label: string;
  sublabel: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'urgent', label: 'High', sublabel: 'Needs quick attention' },
  { value: 'moderate', label: 'Moderate', sublabel: 'Important but not critical' },
  { value: 'low', label: 'Low', sublabel: 'Can be handled in normal queue' },
];

export type ReportType = 'leakage' | 'non_leakage';

export type ReportLeakageType =
  | 'ground_leakage'
  | 'pipe_burst'
  | 'meter_leakage'
  | 'valve_leakage'
  | 'overflow'
  | 'unknown';

export interface ReportClassificationOption {
  value: ReportType;
  label: string;
  swahiliLabel: string;
  description: string;
}

export interface LeakageTypeOption {
  value: ReportLeakageType;
  label: string;
  swahiliLabel: string;
}

export const REPORT_CLASSIFICATION_OPTIONS: ReportClassificationOption[] = [
  {
    value: 'leakage',
    label: 'Leakage',
    swahiliLabel: 'Uvujaji',
    description: 'Escaping, bursting, overflowing, or leaking water.',
  },
  {
    value: 'non_leakage',
    label: 'Non-leakage',
    swahiliLabel: 'Sio uvujaji',
    description: 'Another utility service situation described in your report.',
  },
];

export const LEAKAGE_TYPE_OPTIONS: LeakageTypeOption[] = [
  { value: 'ground_leakage', label: 'Ground Leakage', swahiliLabel: 'Uvujaji wa ardhini' },
  { value: 'pipe_burst', label: 'Pipe Burst', swahiliLabel: 'Kupasuka kwa bomba' },
  { value: 'meter_leakage', label: 'Meter Leakage', swahiliLabel: 'Uvujaji wa mita' },
  { value: 'valve_leakage', label: 'Valve Leakage', swahiliLabel: 'Uvujaji wa vali' },
  { value: 'overflow', label: 'Overflow', swahiliLabel: 'Kufurika' },
  { value: 'unknown', label: "I don't know", swahiliLabel: 'Haijulikani' },
];

/** @deprecated Use LEAKAGE_TYPE_OPTIONS */
export const REPORT_TYPE_OPTIONS = LEAKAGE_TYPE_OPTIONS;

export function getReportClassificationLabel(
  type: ReportType | null | undefined,
  language: 'sw' | 'en' = 'en'
): string {
  const option = REPORT_CLASSIFICATION_OPTIONS.find((item) => item.value === type);
  if (!option) {
    return language === 'sw' ? 'Uvujaji' : 'Leakage';
  }
  return language === 'sw' ? option.swahiliLabel : option.label;
}

export function getLeakageTypeLabel(
  type: ReportLeakageType | null | undefined,
  language: 'sw' | 'en' = 'en'
): string {
  const option = LEAKAGE_TYPE_OPTIONS.find((item) => item.value === type) || LEAKAGE_TYPE_OPTIONS[5];
  if (!option) {
    return language === 'sw' ? 'Haijulikani' : "I don't know";
  }
  return language === 'sw' ? option.swahiliLabel : option.label;
}

/** @deprecated Use getLeakageTypeLabel */
export function getReportTypeLabel(
  type: ReportLeakageType | null | undefined,
  language: 'sw' | 'en' = 'en'
): string {
  return getLeakageTypeLabel(type, language);
}

export function isLeakageReport(type: ReportType | string | null | undefined): boolean {
  return type !== 'non_leakage';
}

export function selectReportType(
  nextType: ReportType,
  setReportType: (value: ReportType) => void,
  setLeakageType: (value: ReportLeakageType | null) => void
) {
  setReportType(nextType);
  if (nextType === 'non_leakage') {
    setLeakageType(null);
  }
}
