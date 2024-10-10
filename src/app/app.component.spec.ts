import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameComponent } from '../app/Components/game/game.component';
import { By } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, GameComponent, ToastrModule.forRoot()],  // Import the standalone AppComponent, GameComponent , Toastr component     
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Allow custom elements schema
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create the app component', () => {
    expect(component).toBeTruthy(); // Verify AppComponent instance is created
  });

  // Test title initialization
  it(`should have title 'RummyGame'`, () => {
    expect(component.title).toEqual('RummyGame'); // Check title value
  });

  // Test rendering of title in template
  it('should render the title in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Rummy Game'); // Check title in HTML
  });

  // Test if GameComponent is loaded within the AppComponent
  it('should contain GameComponent', () => {
    const gameElement = fixture.debugElement.query(By.directive(GameComponent));
    expect(gameElement).toBeTruthy(); // Verify GameComponent is present
  });
});
