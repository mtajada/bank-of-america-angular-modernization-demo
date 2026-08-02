import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingIconComponent } from './banking-icon.component';
import { SharedDesignSystemModule } from './shared-design-system.module';

describe('BankingIconComponent', () => {
  let fixture: ComponentFixture<BankingIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDesignSystemModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingIconComponent);
    fixture.componentInstance.name = 'shield';
    fixture.detectChanges();
  });

  it('renders a local decorative SVG without an image dependency', () => {
    const svg = fixture.nativeElement.querySelector('svg');

    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });
});
