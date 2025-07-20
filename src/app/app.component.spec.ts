import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ConfirmationService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { Confirmation } from 'primeng/api';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let requireConfirmation$: Subject<Confirmation>;
  let accept$: Subject<Confirmation>;

  beforeEach(async () => {
    requireConfirmation$ = new Subject<Confirmation>();
    accept$ = new Subject<Confirmation>();

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ConfirmationService,
          useValue: {
            requireConfirmation$: requireConfirmation$.asObservable(),
            accept: accept$.asObservable(),
            confirm: jasmine.createSpy('confirm'),
            close: jasmine.createSpy('close'),
            onAccept: jasmine.createSpy('onAccept'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // or of({ id: '123' }) if your component expects an 'id'
            queryParams: of({}),
            snapshot: {
              paramMap: new Map(),
              queryParamMap: new Map(),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'next-ui-angular' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('next-ui-angular');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, next-ui-angular',
    );
  });
});
