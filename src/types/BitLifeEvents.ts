
// Re-export types and functions from the unified event system
export type { BitLifeEvent } from './ClassicBitLifeEvents';
export { BITLIFE_EVENTS, generateClassicEvent } from './ClassicBitLifeEvents';

export type { EnhancedEvent, EnhancedChoice, EventCategory } from './EnhancedEvents';
export { ENHANCED_EVENTS, generateEnhancedEvent, processEnhancedChoice } from './EnhancedEvents';

export type { GameEvent, EventGenerationConfig } from './EventManager';
export { 
  generateRandomEvent, 
  isEnhancedEvent, 
  isClassicEvent, 
  getEventDisplayName, 
  getEventType,
  DEFAULT_EVENT_CONFIG 
} from './EventManager';

// Legacy function for backward compatibility
export const generateRandomEventEnhanced = (character: any, eventHistory: any[] = []) => {
  return generateRandomEvent(character, eventHistory);
};
