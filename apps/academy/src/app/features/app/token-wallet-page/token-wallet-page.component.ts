import { Component, inject } from '@angular/core';
import { StudentProgressMockService } from '../../../core/services/student-progress-mock.service';
import { TokenWalletMockService } from '../../../core/services/token-wallet-mock.service';

@Component({
  selector: 'app-token-wallet-page',
  templateUrl: './token-wallet-page.component.html',
})
export class TokenWalletPageComponent {
  private readonly progress = inject(StudentProgressMockService);
  private readonly wallet = inject(TokenWalletMockService);
  readonly dashboard = this.progress.dashboard;
  readonly transactions = this.wallet.transactions;
}
