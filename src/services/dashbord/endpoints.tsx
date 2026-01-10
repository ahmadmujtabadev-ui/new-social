// src/services/dashboard/endpoints.ts
import { HttpService } from "../index";

type QueryParams = Record<string, any>;

class DashboardService extends HttpService {
  private readonly vendorPrefix = "api/v1/vendor";
  private readonly sponsorPrefix = "api/v1/sponsor";
  private readonly participantPrefix = "api/v1/participants";
  private readonly volunteerPrefix = "api/v1/volunteer";
  private readonly eventPrefix = "api/v1/event";
  private readonly promoPrefix = "api/v1/promo";

  // ============================================
  // VENDORS
  // ============================================
  vendors = () => this.get(`${this.vendorPrefix}`, {});
  
  updateVendor = (id: string, updates: any) =>
    this.put(`${this.vendorPrefix}/update/${id}`, updates);

  deleteVendor = (id: string) => 
    this.delete(`${this.vendorPrefix}/${id}`);

  // ============================================
  // SPONSORS
  // ============================================
  sponsors = () => this.get(`${this.sponsorPrefix}`, {});
  
  updateSponsor = (id: string, updates: any) =>
    this.put(`${this.sponsorPrefix}/${id}`, updates);

  deleteSponsor = (id: string) =>
    this.delete(`${this.sponsorPrefix}/${id}`);

  // ============================================
  // PARTICIPANTS
  // ============================================
  participants = () => this.get(`api/v1/participants`, {});
    
  getParticipant = (id: string) => 
    this.get(`${this.participantPrefix}/${id}`, {});
  
  updateParticipant = (id: string, updates: any) =>
    this.put(`${this.participantPrefix}/${id}`, updates);

  deleteParticipant = (id: string) =>
    this.delete(`${this.participantPrefix}/${id}`);

  // ============================================
  // VOLUNTEERS
  // ============================================
  volunteers = () => this.get(`${this.volunteerPrefix}`, {});
  
  getVolunteer = (id: string) => 
    this.get(`${this.volunteerPrefix}/${id}`, {});
  
  updateVolunteer = (id: string, updates: any) =>
    this.put(`${this.volunteerPrefix}/${id}`, updates);

  deleteVolunteer = (id: string) =>
    this.delete(`${this.volunteerPrefix}/${id}`);

  // ============================================
  // BOOTHS & STATS
  // ============================================
  booths = (params: QueryParams = {}) => 
    this.get(`${this.vendorPrefix}/booths`, params);

  stats = () => this.post(`${this.vendorPrefix}/getallstats`, {});

  // ============================================
  // EVENTS
  // ============================================
  events = (params: QueryParams = {}) => 
    this.get(`${this.eventPrefix}/get`, params);
  
  getEvent = (id: string) => 
    this.get(`${this.eventPrefix}/${id}`, {});
  
  createEvent = (eventData: any) =>
    this.post(`${this.eventPrefix}`, eventData);
  
  updateEvent = (id: string, updates: any) =>
    this.put(`${this.eventPrefix}/${id}`, updates);

  deleteEvent = (id: string) =>
    this.delete(`${this.eventPrefix}/${id}`);

  // ============================================
  // PROMO CODES
  // ============================================
  promoCodes = (params: QueryParams = {}) => 
    this.get(`${this.promoPrefix}/get`, params);
  
  getPromoCode = (id: string) => 
    this.get(`${this.promoPrefix}/${id}`, {});
  
  validatePromoCode = (code: string) =>
    this.get(`${this.promoPrefix}/validate/${code}`, {});
  
  createPromoCode = (promoData: any) =>
    this.post(`${this.promoPrefix}`, promoData);
  
  updatePromoCode = (id: string, updates: any) =>
    this.put(`${this.promoPrefix}/${id}`, updates);

  deletePromoCode = (id: string) =>
    this.delete(`${this.promoPrefix}/${id}`);
}

export const dashboardService = new DashboardService();