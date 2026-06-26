import { computed, Injectable, signal } from '@angular/core';
import { tokenTransactionsMock } from '../data/academy.mock-data';
import { TokenTransaction } from '../models/academy.models';

@Injectable({ providedIn: 'root' })
export class TokenWalletMockService {
  private readonly transactionsState = signal<TokenTransaction[]>([...tokenTransactionsMock]);
  readonly transactions = this.transactionsState.asReadonly();
  readonly balanceFromHistory = computed(() =>
    this.transactionsState().reduce((total, transaction) => total + transaction.amount, 0),
  );
}
