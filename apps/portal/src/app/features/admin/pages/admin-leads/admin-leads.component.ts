import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { LeadsApiService } from '../../../../core/services/leads-api.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';

@Component({
    selector: 'app-admin-leads',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-leads.component.html',
    styleUrl: './admin-leads.component.scss'
})
export class AdminLeadsComponent {
    private readonly leadsApi = inject(LeadsApiService);

    protected readonly leads = signal<Lead[]>([]);
    protected readonly isLoading = signal(true);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly totalLeads = computed(() => this.leads().length)

    protected readonly hotLeads = computed(() =>
        this.leads().filter((lead) => lead.temperature === 'Hot').length)

    protected readonly companyLeads = computed(() =>
        this.leads().filter((lead) => lead.visitorType === 'Company').length)

    protected readonly statuses: LeadStatus[] = [
        'New',
        'Qualified',
        'Contacted',
        'Converted',
        'Lost'
    ];

    constructor() {
        this.loadLeads();
    }

    protected loadLeads(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.leadsApi.getLeads().subscribe({
            next: (leads) => {
                this.leads.set(leads);
                this.isLoading.set(false);
            },
            error: () => {
                this.errorMessage.set(
                    'Não foi possível carregar os leads. Verifique se a neural-api está rodando.'
                );
                this.isLoading.set(false);
            }
        })
    }

    protected changeStatus(lead: Lead, status: LeadStatus): void {
        this.leadsApi.changeStatus(lead.id, status).subscribe({
            next: (updatedLead) => {
                this.leads.update((currentLeads) =>
                    currentLeads.map((currentLead) =>
                        currentLead.id === updatedLead.id ? updatedLead : currentLead
                    )
                )
            },
            error: () => {
                this.errorMessage.set('Não foi possível atualizar o status do lead.')
            }
        })
    }

    protected getLeadTitle(lead: Lead): string{
        return lead.name || lead.companyName || lead.email || 'Visitante sem identificação'
    }

    protected getTemperatureLabel(temperature: string): string {
        const labels: Record<string, string> = {
            Hot: 'Quente',
            Warm: 'Morno',
            Cold: 'Frio'
        }

        return labels[temperature] ?? temperature;
    }

    protected getVisitorTypeLabel(visitorType: string): string{
        const labels: Record<string, string> = {
            Company: 'Empresa',
            Developer: 'Dev',
            Student: 'Aluno',
            Recruiter: 'Recrutador',
            Curious: 'Curioso',
            Partner: 'Parceiro',
            Unknown: 'Desconhecido'
        }

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

}
