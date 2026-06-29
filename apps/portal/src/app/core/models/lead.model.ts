export interface LeadMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  visitorType: string;
  intent: string;
  temperature: string;
  status: string;
  source: string;
  summary?: string | null;
  recommendedProduct?: string | null;
  nextAction?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: LeadMessage[];
}

export type LeadStatus =
  | 'New'
  | 'Qualified'
  | 'Contacted'
  | 'Converted'
  | 'Lost';
