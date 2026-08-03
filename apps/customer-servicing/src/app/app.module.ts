import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FINANCIAL_DATA_PROVIDER,
  CompositeFinancialDataProvider,
  LocalMfaGateway,
  LocalSsoSessionGateway,
  MemoryProprietaryAnalyticsSdk,
  MFA_GATEWAY,
  PROPRIETARY_ANALYTICS_SDK,
  RedactedTransferAnalyticsAdapter,
  SSO_SESSION_GATEWAY,
  TRANSFER_ANALYTICS,
} from '@bank-of-america-demo/shared-integrations';
import { SharedSecureTransferModule } from '@bank-of-america-demo/secure-transfer';
import { SharedDesignSystemModule } from '@bank-of-america-demo/design-system';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedDesignSystemModule,
    SharedSecureTransferModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [
    { provide: MFA_GATEWAY, useClass: LocalMfaGateway },
    { provide: SSO_SESSION_GATEWAY, useClass: LocalSsoSessionGateway },
    {
      provide: PROPRIETARY_ANALYTICS_SDK,
      useClass: MemoryProprietaryAnalyticsSdk,
    },
    { provide: TRANSFER_ANALYTICS, useClass: RedactedTransferAnalyticsAdapter },
    {
      provide: FINANCIAL_DATA_PROVIDER,
      useClass: CompositeFinancialDataProvider,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
