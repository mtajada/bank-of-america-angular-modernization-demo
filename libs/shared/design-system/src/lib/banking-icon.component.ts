import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BankingIconName =
  | 'institution'
  | 'account'
  | 'recipient'
  | 'shield'
  | 'relationship'
  | 'transfer'
  | 'overview'
  | 'customers'
  | 'case'
  | 'controls'
  | 'search'
  | 'bell';

@Component({
  selector: 'bofa-demo-banking-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <ng-container [ngSwitch]="name">
        <g *ngSwitchCase="'institution'">
          <path d="M3 9h18" />
          <path d="M5 9v9M9.7 9v9M14.3 9v9M19 9v9" />
          <path d="M3 18h18M4 21h16" />
          <path d="m4 7 8-4 8 4v2H4V7Z" />
        </g>
        <g *ngSwitchCase="'account'">
          <path
            d="M4 6.5h14a2 2 0 0 1 2 2V18H4a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z"
          />
          <path d="M4 6.5V5a2 2 0 0 1 2-2h11" />
          <path d="M15.5 12h4.5M16 12h.01" />
        </g>
        <g *ngSwitchCase="'recipient'">
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </g>
        <g *ngSwitchCase="'shield'">
          <path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </g>
        <g *ngSwitchCase="'relationship'">
          <path d="m9 15-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" />
          <path d="m15 9 1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" />
          <path d="m8 12 8 0" />
        </g>
        <g *ngSwitchCase="'transfer'">
          <path d="M4 8h14M15 5l3 3-3 3" />
          <path d="M20 16H6M9 13l-3 3 3 3" />
        </g>
        <g *ngSwitchCase="'overview'">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
        </g>
        <g *ngSwitchCase="'customers'">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4 4.9" />
        </g>
        <g *ngSwitchCase="'case'">
          <path d="M3 6.5h7l2 2h9v10.5H3z" />
          <path d="M3 9h18" />
        </g>
        <g *ngSwitchCase="'controls'">
          <path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="14" cy="18" r="2" />
        </g>
        <g *ngSwitchCase="'search'">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4.5 4.5" />
        </g>
        <g *ngSwitchCase="'bell'">
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </g>
      </ng-container>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex: 0 0 auto;
        height: 1em;
        width: 1em;
      }

      svg {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class BankingIconComponent {
  @Input() name: BankingIconName = 'institution';
}
