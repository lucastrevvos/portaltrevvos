import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { Lead, LeadStatus } from '../models/lead.model'

@Injectable({
    providedIn: 'root'
})
export class LeadsApiService {
    private readonly http = inject(HttpClient);

    private readonly apiBaseUrl = 'http://localhost:5069/api';

    getLeads(): Observable<Lead[]>{
        return this.http.get<Lead[]>(`${this.apiBaseUrl}/admin/leads`);
    }

    getLead(id: string): Observable<Lead>{
        return this.http.get<Lead>(`${this.apiBaseUrl}/admin/leads/${id}`);
    }

    changeStatus(id: string, status: LeadStatus): Observable<Lead>{
        return this.http.patch<Lead>(`${this.apiBaseUrl}/admin/leads/${id}/status`, {
            status
        })
    }
}
