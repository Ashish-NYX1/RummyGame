import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',  // Defines the custom HTML tag <app-card> for this component
  standalone: true,      // Marks this component as standalone, meaning it doesn't require a module
  imports: [CommonModule],  // Imports Angular's CommonModule, which provides common directives like ngIf and ngFor
  templateUrl: './card.component.html',  // Path to the HTML template that defines how the card is displayed
  styleUrl: './card.component.css'  // Path to the CSS file that styles the component
})
export class CardComponent {
  // Input property that allows data (a card object) to be passed into this component from a parent component
  @Input() card!: { suit: string; rank: string };
  // The card object must have 'suit' and 'rank' properties, both of which are strings.
  // The exclamation mark (!) tells TypeScript to ignore potential undefined values and assume this input will be provided.
}
