import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { YourComponent } from './your.component';
import { Router } from '@angular/router';

describe('YourComponent', () => {
  let component: YourComponent;
  let fixture: ComponentFixture<YourComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [YourComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call navigate and then reload the window', fakeAsync(() => {
    // Arrange
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    spyOn(window.location, 'reload');

    // Act
    component.redirect(); // or simulate button click
    tick(); // simulate passage of async time

    // Assert
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/some-path']);
    expect(window.location.reload).toHaveBeenCalled();
  }));
});