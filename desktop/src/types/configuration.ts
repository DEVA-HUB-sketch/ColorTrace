export type ConfigurationOutcomeClass = 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE';

export interface ConfigurationOption {
  id: string;
  name: string;
  version: string;
  description: string;
  referenceConfiguration?: string;
  status?: string;
  supportedOutcomeClasses?: ConfigurationOutcomeClass[];
}
