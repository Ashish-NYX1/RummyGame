import { Component, OnInit } from '@angular/core';
import { GameService } from '../../Services/game.service';
import { Card } from '../../models/card'; // Defines the structure of a Card
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  // Player and computer hands to hold their respective cards
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  selectedCard: Card | null = null; // Card selected by the player for discarding
  gameStatus: string = ''; // Holds the current game status message

  constructor(public gameService: GameService, private toastr: ToastrService) { }

  // Lifecycle hook called on component initialization
  ngOnInit() {
    this.startGame(); // Starts a new game on initialization
  }

  // Displays a turn message using Toastr (e.g., "Your Turn", "Computer's Turn")
  showTurnMessage(message: string) {
    this.toastr.info(message);
  }

  // Initializes a new game by resetting deck, dealing hands, clearing discard pile
  startGame() {
    this.gameService.initializeDeck(); // Shuffles and prepares a new deck
    this.playerHand = this.gameService.dealHand(); // Deals 13 cards to player
    this.computerHand = this.gameService.dealHand(); // Deals 13 cards to computer
    this.gameService.discardPile = []; // Clears the discard pile for a fresh game
    this.toastr.info('New Game Started! Draw a card or discard.'); // Shows new game notification
    this.gameStatus = 'Game started! Draw a card or discard.'; // Sets initial game status
  }

  // Player draws a card from the deck and adds it to their hand
  playerDrawFromDeck() {
    const card = this.gameService.drawFromDeck();
    if (card) this.playerHand.push(card);
  }

  // Player draws a card from the discard pile and adds it to their hand
  playerDrawFromDiscard() {
    const card = this.gameService.drawFromDiscard();
    if (card) this.playerHand.push(card);
  }

  // Handles the player's discard action, removes the selected card from hand
  playerDiscard(card: Card) {
    this.playerHand = this.playerHand.filter(c => c !== card); // Removes card from hand
    this.gameService.discard(card); // Adds the card to the discard pile
    this.checkForWin(); // Checks if player wins after discarding
  }

  // Checks if the player's hand is a winning hand
  checkForWin() {
    if (this.gameService.checkForRummy(this.playerHand)) {
      this.toastr.success('You win!'); // Notifies player of win
      this.gameStatus = 'You win!'; // Updates game status
    } else {
      this.computerTurn(); // Initiates computer's turn if player hasn't won
    }
  }

  // Simulates the computer's turn to draw and discard a card
  computerTurn() {
    const card = this.gameService.drawFromDeck();
    if (card) this.computerHand.push(card);

    const discard = this.selectBestDiscard(this.computerHand); // Chooses a discard card
    if (discard) {
      this.computerHand = this.computerHand.filter(c => c !== discard); // Removes selected discard
      this.gameService.discard(discard); // Adds the discard to the discard pile
    }

    // Checks if the computer's hand meets the winning condition
    if (this.gameService.validateHand(this.computerHand)) {
      this.toastr.error('Computer wins!'); // Notifies player of computer's win
      this.gameStatus = 'Computer wins!'; // Updates game status
    } else {
      this.showTurnMessage('Your turn!'); // Notifies player of their turn
      this.gameStatus = 'Your turn!'; // Updates game status to player's turn
    }
  }

  // Placeholder logic for computer's discard selection; currently selects last card
  selectBestDiscard(hand: Card[]): Card {
    // Returns the last card of the hand as a basic discard choice
    // More sophisticated logic could be added here for strategic discards
    return hand[hand.length - 1];
  }
}
