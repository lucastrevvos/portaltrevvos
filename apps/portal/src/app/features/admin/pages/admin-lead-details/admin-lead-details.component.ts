import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Lead, LeadStatus } from '../../../../core/models/lead.model';
import { LeadsApiService } from '../../../../core/services/leads-api.service';

@Component({
  selector: 'app-admin-lead-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-lead-details.component.html',
  styleUrl: './admin-lead-details.component.scss',
})
export class AdminLeadDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly leadsApi = inject(LeadsApiService);

  protected readonly lead = signal<Lead | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly statuses: LeadStatus[] = [
    'New',
    'Qualified',
    'Contacted',
    'Converted',
    'Lost',
  ];

  protected readonly sortedMessages = computed(() => {
    const lead = this.lead();

    if (!lead) {
      return [];
    }

    return [...lead.messages].sort((first, second) =>
      first.createdAt.localeCompare(second.createdAt),
    );
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Lead não encontrado.');
      this.isLoading.set(false);
      return;
    }

    this.loadLead(id);
  }

  protected loadLead(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.leadsApi.getLead(id).subscribe({
      next: (lead) => {
        this.lead.set(lead);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o lead.');
        this.isLoading.set(false);
      },
    });
  }

  protected changeStatus(status: LeadStatus): void {
    const currentLead = this.lead();

    if (!currentLead) {
      return;
    }

    this.leadsApi.changeStatus(currentLead.id, status).subscribe({
      next: (updatedLead) => {
        this.lead.set(updatedLead);
      },
      error: () => {
        this.errorMessage.set('Não foi possível atualizar o status do lead.');
      },
    });
  }

  protected getTemperatureLabel(temperature: string): string {
    const labels: Record<string, string> = {
      Hot: 'Quente',
      Warm: 'Morno',
      Cold: 'Frio',
    };

    return labels[temperature] ?? temperature;
  }

  protected getVisitorTypeLabel(visitorType: string): string {
    const labels: Record<string, string> = {
      Company: 'Empresa',
      Developer: 'Dev',
      Student: 'Aluno',
      Recruiter: 'Recrutador',
      Curious: 'Curioso',
      Partner: 'Parceiro',
      Unknown: 'Desconhecido',
    };

    return labels[visitorType] ?? visitorType;
  }

  protected getIntentLabel(intent: string): string {
    const labels: Record<string, string> = {
      HireAutomation: 'Contratar automação',
      LearnAi: 'Aprender IA',
      LearnSoftwareEngineering: 'Aprender engenharia',
      UseForge: 'Usar Forge',
      UseAcademy: 'Usar Academy',
      AnalyzeGithub: 'Analisar GitHub',
      KnowTrevvos: 'Conhecer Trevvos',
      Partnership: 'Parceria',
      Support: 'Suporte',
      Unknown: 'Desconhecido',
    };

    return labels[intent] ?? intent;
  }

  protected getLeadTitle(lead: Lead): string {
    return lead.name || lead.companyName || lead.email || 'Visitante sem identificação';
  }
}
