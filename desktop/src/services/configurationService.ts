import { frontendConfigurationPresets } from '@/data/configurationOptions';
import type { ConfigurationOption } from '@/types/configuration';

// TODO: Replace local frontend presets with the authoritative backend configuration API
// when the backend API contract is available.

/**
 * Retrieves the available configuration presets for the frontend workflow.
 * Currently returns local static presets.
 */
export function getConfigurationOptions(): ConfigurationOption[] {
  return frontendConfigurationPresets;
}

/**
 * Retrieves a specific configuration option by its ID.
 */
export function getConfigurationById(configurationId: string): ConfigurationOption | undefined {
  if (!configurationId) {
    return undefined;
  }
  return frontendConfigurationPresets.find((config) => config.id === configurationId);
}

/**
 * Returns the default configuration preset for the initial workflow state.
 */
export function getDefaultConfiguration(): ConfigurationOption | undefined {
  return frontendConfigurationPresets[0];
}
