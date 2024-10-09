// game.service.ts
import { Injectable } from '@angular/core';

interface Card {
  suit: string;
  rank: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  deck: Card[] = [];

  constructor() {
    this.initializeDeck();
  }

  initializeDeck() {
    this.deck = [];
    this.suits.forEach(suit => {
      this.ranks.forEach(rank => {
        this.deck.push({ suit, rank });
      });
    });
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealHand() {
    return this.deck.splice(0, 13);  // Deal 13 cards for rummy
  }
}
