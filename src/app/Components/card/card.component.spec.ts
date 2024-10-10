import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    // Configure testing module with the CardComponent
    await TestBed.configureTestingModule({
      imports: [CardComponent],  // Imports the standalone component directly
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    // Create the component fixture and instance
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  // Test case for component creation
  it('should create', () => {
    expect(component).toBeTruthy();  // Verify that the component instance is created successfully
  });

  // Test case for input binding of the `card` property
  it('should display the card suit and rank based on input', () => {
    // Define a mock card input to test
    const mockCard = { suit: 'hearts', rank: 'A' };
    component.card = mockCard;  // Assign the mock card to the component's `card` input
    fixture.detectChanges();  // Trigger change detection to update the template with the new input

    // Verify that the card suit is rendered in the template
    const suitElement = fixture.debugElement.query(By.css('.card-suit'));
    expect(suitElement.nativeElement.textContent.toLowerCase()).toContain('hearts');

    // Verify that the card rank is rendered in the template
    const rankElement = fixture.debugElement.query(By.css('.card-rank'));
    expect(rankElement.nativeElement.textContent).toContain('A');
  });

  // Test case for handling missing input
  it('should handle missing card input gracefully', () => {
    component.card = undefined as any;  // Set the input to an undefined value
    expect(() => fixture.detectChanges()).not.toThrow();  // Ensure no error is thrown
  });

  // Test for dynamically changing the input
  it('should update the displayed card details when input changes', () => {
    // First mock card input
    const firstMockCard = { suit: 'diamonds', rank: '10' };
    component.card = firstMockCard;  // Set the first card
    fixture.detectChanges();

    // Verify the initial suit and rank displayed
    const suitElement = fixture.debugElement.query(By.css('.card-suit'));
    const rankElement = fixture.debugElement.query(By.css('.card-rank'));
    expect(suitElement.nativeElement.textContent.toLowerCase()).toContain('diamonds');
    expect(rankElement.nativeElement.textContent).toContain('10');

    // Change the card input to a new card
    const secondMockCard = { suit: 'clubs', rank: 'K' };
    component.card = secondMockCard;  // Update the input
    fixture.detectChanges();  // Trigger change detection to update the view

    // Verify the updated suit and rank are displayed
    expect(suitElement.nativeElement.textContent.toLowerCase()).toContain('clubs');
    expect(rankElement.nativeElement.textContent).toContain('K');
  });

  // Test case to verify the component displays a specific class for the suit
  it('should apply a specific CSS class based on the card suit', () => {
    // Define a mock card with the "spades" suit
    const mockCard = { suit: 'spades', rank: 'Q' };
    component.card = mockCard;  // Set the input
    fixture.detectChanges();

    // Verify the component has the CSS class corresponding to "spades"
    const cardElement = fixture.debugElement.query(By.css('.card'));
    expect(cardElement.classes['spades']).toBeTrue();
  });
});
