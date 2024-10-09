import { Component, OnInit } from '@angular/core';
import { GameService } from '../../Services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  playerHand: any[] = [];
  computerHand: any[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.gameService.initializeDeck();
    this.playerHand = this.gameService.dealHand();
    this.computerHand = this.gameService.dealHand();
  }
}
