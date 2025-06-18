import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaScreenComponent } from './captcha-screen.component';

describe('CaptchaScreenComponent', () => {
  let component: CaptchaScreenComponent;
  let fixture: ComponentFixture<CaptchaScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptchaScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptchaScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
