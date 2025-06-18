
import { BitLifeEvent, generateClassicEvent } from './ClassicBitLifeEvents';
import { EnhancedEvent, generateEnhancedEvent } from './EnhancedEvents';

export type GameEvent = BitLifeEvent | EnhancedEvent;

export interface EventGenerationConfig {
  enhancedEventWeight: number; // 0-1, probability of enhanced vs classic events
  maxEventsPerYear: number;
  cooldownBetweenEvents: number; // minimum days between events
}

export const DEFAULT_EVENT_CONFIG: EventGenerationConfig = {
  enhancedEventWeight: 0.7, // 70% chance for enhanced events
  maxEventsPerYear: 4,
  cooldownBetweenEvents: 30
};

// Unified event generation that combines both systems
export const generateRandomEvent = (
  character: any, 
  eventHistory: any[] = [],
  config: EventGenerationConfig = DEFAULT_EVENT_CONFIG
): GameEvent | null => {
  // Check cooldown - prevent event spam
  const lastEvent = eventHistory
    .filter(e => e.eventId)
    .sort((a, b) => b.year - a.year)[0];
  
  if (lastEvent) {
    const daysSinceLastEvent = (character.age - lastEvent.age) * 365;
    if (daysSinceLastEvent < config.cooldownBetweenEvents) {
      return null;
    }
  }
  
  // Check max events per year
  const currentYear = character.birthYear + character.age;
  const eventsThisYear = eventHistory.filter(e => e.year === currentYear && e.eventId).length;
  if (eventsThisYear >= config.maxEventsPerYear) {
    return null;
  }
  
  // Determine event type based on weight
  const useEnhanced = Math.random() < config.enhancedEventWeight;
  
  if (useEnhanced) {
    return generateEnhancedEvent(character, eventHistory);
  } else {
    return generateClassicEvent(character.age);
  }
};

// Type guards to determine event type
export const isEnhancedEvent = (event: GameEvent): event is EnhancedEvent => {
  return 'category' in event;
};

export const isClassicEvent = (event: GameEvent): event is BitLifeEvent => {
  return !('category' in event);
};

// Event processing utilities
export const getEventDisplayName = (event: GameEvent): string => {
  return event.title;
};

export const getEventType = (event: GameEvent): string => {
  if (isEnhancedEvent(event)) {
    return event.category;
  }
  return event.type;
};
