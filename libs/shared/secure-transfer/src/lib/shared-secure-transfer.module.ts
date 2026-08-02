import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDesignSystemModule } from '@bank-of-america-demo/design-system';

import { SecureTransferConfirmationComponent } from './secure-transfer-confirmation.component';

@NgModule({
  declarations: [SecureTransferConfirmationComponent],
  imports: [CommonModule, FormsModule, SharedDesignSystemModule],
  exports: [SecureTransferConfirmationComponent],
})
export class SharedSecureTransferModule {}
