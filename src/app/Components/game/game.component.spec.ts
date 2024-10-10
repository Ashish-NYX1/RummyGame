import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameService } from '../../Services/game.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Card } from '../../models/card';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    // Create mock instances of GameService and ToastrService
    const gameServiceSpy = jasmine.createSpyObj('GameService', [
      'initializeDeck', 'dealHand', 'drawFromDeck', 'drawFromDiscard', 'discard', 'checkForRummy', 'validateHand'
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['info', 'success', 'error']);

    // Configure testing module with component and mock providers
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    // Initialize component and inject mocks
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    gameService.drawFromDeck.and.returnValue({ suit: 'hearts', rank: '10' });
    gameService.dealHand.and.returnValue([
      { suit: 'hearts', rank: '10' },
      { suit: 'spades', rank: 'K' },
      { suit: 'diamonds', rank: '3' }
    ]);


    fixture.detectChanges(); // Trigger initial data binding
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy(); // Verify component instance is created
  });

  // Test initialization on component load
  it('should initialize game on component load', () => {
    spyOn(component, 'startGame'); // Spy on startGame method
    component.ngOnInit(); // Trigger ngOnInit lifecycle
    expect(component.startGame).toHaveBeenCalled(); // Verify startGame is called
  });

  // Test starting a new game
  it('should start a new game', () => {
    gameService.dealHand.calls.reset();
    component.startGame(); // Call startGame method
    expect(gameService.initializeDeck).toHaveBeenCalledTimes(2); // Deck should be initialized
    expect(gameService.dealHand).toHaveBeenCalledTimes(2); // Player and computer hands dealt
    expect(component.playerHand.length).toBeGreaterThan(0); // Player has cards
    expect(component.computerHand.length).toBeGreaterThan(0); // Computer has cards
    expect(gameService.discardPile).toEqual([]); // Discard pile is reset
    expect(toastr.info).toHaveBeenCalledWith('New Game Started! Draw a card or discard.');
  });

  // Test player drawing from deck
  it('should allow player to draw from deck', () => {
    const mockCard: Card = { suit: 'hearts', rank: '5' };
    gameService.drawFromDeck.and.returnValue(mockCard); // Mock deck draw
    component.playerDrawFromDeck(); // Player draws from deck
    expect(gameService.drawFromDeck).toHaveBeenCalled(); // Deck draw function is called
    expect(component.playerHand).toContain(mockCard); // Card is added to player's hand
  });

  // Test player drawing from discard pile
  it('should allow player to draw from discard pile', () => {
    const mockCard: Card = { suit: 'spades', rank: '7' };
    gameService.drawFromDiscard.and.returnValue(mockCard); // Mock discard pile draw
    component.playerDrawFromDiscard(); // Player draws from discard pile
    expect(gameService.drawFromDiscard).toHaveBeenCalled(); // Discard pile draw is called
    expect(component.playerHand).toContain(mockCard); // Card is added to player's hand
  });

  // Test player discarding a card
  it('should discard selected card from player hand and add to discard pile', () => {
    const mockCard: Card = { suit: 'diamonds', rank: '8' };
    component.playerHand = [mockCard]; // Add mock card to player's hand
    spyOn(component, 'checkForWin'); // Spy on checkForWin method
    component.playerDiscard(mockCard); // Player discards card
    expect(component.playerHand).not.toContain(mockCard); // Card is removed from hand
    expect(gameService.discard).toHaveBeenCalledWith(mockCard); // Card added to discard pile
    expect(component.checkForWin).toHaveBeenCalled(); // Win check is performed
  });

  // Test player win condition
  it('should notify player when they win', () => {
    gameService.checkForRummy.and.returnValue(true); // Mock winning hand
    component.checkForWin(); // Check for win
    expect(toastr.success).toHaveBeenCalledWith('You win!'); // Success notification shown
    expect(component.gameStatus).toBe('You win!'); // Game status updated
  });

  // Test non-winning player discard leading to computer's turn
  it('should proceed to computer turn if player does not win', () => {
    gameService.checkForRummy.and.returnValue(false); // Mock non-winning hand
    spyOn(component, 'computerTurn'); // Spy on computerTurn
    component.checkForWin(); // Check for win
    expect(component.computerTurn).toHaveBeenCalled(); // Computer's turn triggered
  });

  // Test computer turn without winning
  it('should handle computer turn with no win and notify player', () => {
    const mockCard: Card = { suit: 'hearts', rank: '10' };
    gameService.drawFromDeck.and.returnValue(mockCard); // Mock deck draw
    gameService.validateHand.and.returnValue(false); // Mock non-winning hand for computer
    spyOn(component, 'selectBestDiscard').and.returnValue(mockCard); // Mock discard selection
    component.computerTurn(); // Computer's turn
    expect(gameService.drawFromDeck).toHaveBeenCalled(); // Deck draw is called
    expect(component.computerHand).toContain(mockCard); // Card added to computer's hand
    expect(toastr.info).toHaveBeenCalledWith('Your turn!'); // Player notified it's their turn
    expect(component.gameStatus).toBe('Your turn!'); // Game status updated
  });

  // Test computer win scenario
  it('should notify when computer wins', () => {
    component.computerHand = [];
    const mockCard: Card = { suit: 'clubs', rank: '2' };
    gameService.drawFromDeck.and.returnValue(mockCard); // Mock deck draw
    gameService.validateHand.and.returnValue(true); // Mock winning hand for computer
    spyOn(component, 'selectBestDiscard').and.returnValue(mockCard); // Mock discard selection
    component.computerTurn(); // Computer's turn
    expect(toastr.error).toHaveBeenCalledWith('Computer wins!'); // Computer win notification
    expect(component.gameStatus).toBe('Computer wins!'); // Game status updated
  });

  // Test selecting best discard for computer
  it('should select the last card in hand as best discard', () => {
    const mockHand: Card[] = [
      { suit: 'hearts', rank: '5' },
      { suit: 'spades', rank: '7' },
      { suit: 'diamonds', rank: '8' }
    ];
    const discard = component.selectBestDiscard(mockHand); // Get discard card
    expect(discard).toEqual(mockHand[mockHand.length - 1]); // Last card in hand is selected
  });

  // Test displaying a turn message
  it('should show turn message using toastr', () => {
    const message = 'Your turn!'; // Define message
    component.showTurnMessage(message); // Call showTurnMessage
    expect(toastr.info).toHaveBeenCalledWith(message); // Toastr displays message
  });
});
