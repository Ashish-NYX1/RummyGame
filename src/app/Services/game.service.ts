import { Injectable } from '@angular/core';

// Card interface defining the structure of a card object with suit and rank properties
interface Card {
  suit: string;
  rank: string;
}

@Injectable({
  providedIn: 'root'  // Makes this service available application-wide
})
export class GameService {
  // Define card suits and ranks for a standard deck
  suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  // Array to hold the deck and discard pile of cards
  deck: Card[] = [];
  discardPile: Card[] = [];

  constructor() {
    this.initializeDeck(); // Initialize deck when service is created
  }

  // Method to create a new deck by combining all suits and ranks
  initializeDeck() {
    this.deck = []; // Clear existing deck
    this.suits.forEach(suit => {
      this.ranks.forEach(rank => {
        this.deck.push({ suit, rank }); // Add each card to the deck
      });
    });
    this.shuffleDeck(); // Shuffle the deck after creating it
  }

  // Method to shuffle the deck using the Fisher-Yates algorithm
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; // Swap cards
    }
  }

  // Method to deal 13 cards for a Rummy hand
  dealHand() {
    return this.deck.splice(0, 13); // Remove 13 cards from the deck and return them
  }

  // Draws the top card from the deck, removing it from the array
  drawFromDeck() {
    return this.deck.pop(); // Remove and return the last card in the deck
  }

  // Draws the top card from the discard pile, removing it from the array
  drawFromDiscard() {
    return this.discardPile.pop(); // Remove and return the last card in the discard pile
  }

  // Adds a card to the discard pile
  discard(card: Card) {
    this.discardPile.push(card); // Place the card on top of the discard pile
  }

  // Checks if the player's hand is a winning hand with valid sets and runs
  checkForRummy(hand: Card[]): boolean {
    return this.validateHand(hand); // Calls validateHand to verify Rummy condition
  }

  // Validates a hand by finding at least one set and one run
  public validateHand(hand: Card[]): boolean {
    const sets = this.findSets(hand); // Finds sets in the hand
    const runs = this.findRuns(hand); // Finds runs in the hand

    // Valid if there is at least one set and one run
    return sets.length > 0 && runs.length > 0;
  }

  // Finds all sets (groups of 3+ cards of the same rank) in a hand
  public findSets(hand: Card[]): Card[][] {
    const sets: Card[][] = []; // Array to hold found sets
    const rankGroups = hand.reduce((groups, card) => {
      groups[card.rank] = groups[card.rank] || []; // Initialize group if not present
      groups[card.rank].push(card); // Add card to group by rank
      return groups;
    }, {} as Record<string, Card[]>);

    for (const rank in rankGroups) {
      if (rankGroups[rank].length >= 3) {
        sets.push(rankGroups[rank]); // Add group to sets if it has 3+ cards
      }
    }
    return sets;
  }

  // Finds all runs (consecutive cards in the same suit) in a hand
  public findRuns(hand: Card[]): Card[][] {
    const runs: Card[][] = []; // Array to hold found runs
    const suitGroups = hand.reduce((groups, card) => {
      groups[card.suit] = groups[card.suit] || []; // Initialize group if not present
      groups[card.suit].push(card); // Add card to group by suit
      return groups;
    }, {} as Record<string, Card[]>);

    // Process each suit group to find consecutive sequences
    for (const suit in suitGroups) {
      const sortedSuit = suitGroups[suit].sort((a, b) => this.getRankValue(a.rank) - this.getRankValue(b.rank)); // Sort cards by rank
      let run: Card[] = [sortedSuit[0]]; // Start a new run with the first card

      for (let i = 1; i < sortedSuit.length; i++) {
        const currentCard = sortedSuit[i];
        const lastCard = run[run.length - 1];

        if (this.getRankValue(currentCard.rank) === this.getRankValue(lastCard.rank) + 1) {
          run.push(currentCard); // Add card to run if it's consecutive
        } else {
          if (run.length >= 3) runs.push([...run]); // Add run to runs if valid
          run = [currentCard]; // Start a new run
        }
      }
      if (run.length >= 3) runs.push(run); // Add the last run if valid
    }
    return runs;
  }

  // Helper method to get numerical value of card rank
  public getRankValue(rank: string): number {
    const rankOrder: { [key: string]: number } = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14 // Define values for each rank
    };
    return rankOrder[rank] || 0; // Return rank value or 0 if invalid
  }
}
