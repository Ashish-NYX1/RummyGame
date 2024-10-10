import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    // Configure TestBed and create GameService instance before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  // Test service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test deck initialization
  it('should initialize deck with 52 unique cards', () => {
    service.initializeDeck();
    expect(service.deck.length).toBe(52); // Deck should contain 52 cards
    const uniqueCards = new Set(service.deck.map(card => `${card.rank} of ${card.suit}`));
    expect(uniqueCards.size).toBe(52); // Verify all cards are unique
  });

  // Test deck shuffling
  it('should shuffle the deck', () => {
    service.initializeDeck();
    const initialDeckOrder = [...service.deck]; // Copy initial order
    service.shuffleDeck();
    expect(service.deck).not.toEqual(initialDeckOrder); // Deck should be shuffled
  });

  // Test dealing a hand of 13 cards
  it('should deal a hand of 13 cards', () => {
    service.initializeDeck();
    const hand = service.dealHand();
    expect(hand.length).toBe(13); // Hand should contain 13 cards
    expect(service.deck.length).toBe(39); // Remaining deck should have 39 cards
  });

  // Test drawing from the deck
  it('should draw the top card from the deck', () => {
    service.initializeDeck();
    const topCard = service.deck[service.deck.length - 1]; // Get the top card
    const drawnCard = service.drawFromDeck();
    expect(drawnCard).toEqual(topCard); // Drawn card should match the top card
    expect(service.deck.length).toBe(51); // Deck should have one less card
  });

  // Test drawing from an empty deck
  it('should return undefined when drawing from an empty deck', () => {
    service.deck = []; // Clear the deck
    const drawnCard = service.drawFromDeck();
    expect(drawnCard).toBeUndefined(); // Should return undefined for empty deck
  });

  // Test drawing from the discard pile
  it('should draw the top card from the discard pile', () => {
    const card = { suit: 'hearts', rank: '7' };
    service.discardPile.push(card); // Add a card to discard pile
    const drawnCard = service.drawFromDiscard();
    expect(drawnCard).toEqual(card); // Drawn card should match the last discarded
    expect(service.discardPile.length).toBe(0); // Discard pile should be empty
  });

  // Test discarding a card
  it('should add a card to the discard pile', () => {
    const card = { suit: 'spades', rank: 'K' };
    service.discard(card); // Discard a card
    expect(service.discardPile.length).toBe(1); // Discard pile should have 1 card
    expect(service.discardPile[0]).toEqual(card); // Card should be at the top of discard pile
  });

  // Test hand validation for a winning hand
  it('should validate a winning hand with sets and runs', () => {
    const hand = [
      { suit: 'hearts', rank: '5' },
      { suit: 'hearts', rank: '6' },
      { suit: 'hearts', rank: '7' },
      { suit: 'diamonds', rank: '8' },
      { suit: 'diamonds', rank: '8' },
      { suit: 'diamonds', rank: '8' }
    ];
    expect(service.validateHand(hand)).toBe(true); // Hand has a valid set and run
  });

  // Test hand validation for a non-winning hand
  it('should invalidate a hand without sets or runs', () => {
    const hand = [
      { suit: 'hearts', rank: '2' },
      { suit: 'clubs', rank: '3' },
      { suit: 'spades', rank: '5' },
      { suit: 'diamonds', rank: '7' }
    ];
    expect(service.validateHand(hand)).toBe(false); // Hand has no set or run
  });

  // Test finding sets in a hand
  it('should find sets in a hand', () => {
    const hand = [
      { suit: 'hearts', rank: '4' },
      { suit: 'spades', rank: '4' },
      { suit: 'diamonds', rank: '4' },
      { suit: 'clubs', rank: '8' }
    ];
    const sets = service.findSets(hand);
    expect(sets.length).toBe(1); // One set found
    expect(sets[0].length).toBe(3); // Set contains 3 cards
  });

  // Test finding runs in a hand
  it('should find runs in a hand', () => {
    const hand = [
      { suit: 'hearts', rank: '7' },
      { suit: 'hearts', rank: '8' },
      { suit: 'hearts', rank: '9' },
      { suit: 'diamonds', rank: '4' }
    ];
    const runs = service.findRuns(hand);
    expect(runs.length).toBe(1); // One run found
    expect(runs[0].length).toBe(3); // Run contains 3 cards
  });

  // Test getRankValue method
  it('should return correct rank value for a given rank', () => {
    expect(service.getRankValue('A')).toBe(14); // Ace is 14
    expect(service.getRankValue('10')).toBe(10); // Ten is 10
    expect(service.getRankValue('J')).toBe(11); // Jack is 11
  });
});
