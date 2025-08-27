import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeBalance } from './charge-balance';

describe('ChargeBalance', () => {
  let component: ChargeBalance;
  let fixture: ComponentFixture<ChargeBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeBalance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeBalance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
