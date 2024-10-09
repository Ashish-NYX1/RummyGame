import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../app/Components/game/game.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent], // Import GameComponent directly
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add schema for custom elements
})
export class AppComponent {
  title = 'RummyGame';
}
