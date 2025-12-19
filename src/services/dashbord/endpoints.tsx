// src/services/dashboard/endpoints.ts
import { HttpService } from "../index";

type QueryParams = Record<string, any>;

class DashboardService extends HttpService {
  private readonly prefix = "api/v1/vendor";

  vendors = () => this.get(`${this.prefix}`, {});             
  sponsors = () => this.get(`api/v1/sponsor`, {});            
  booths = (params: QueryParams = {}) => this.get(`${this.prefix}/booths`, params);

  stats = () => this.get(`${this.prefix}/vendors/stats`, {}); 

  updateVendor = (id: string, updates: any) =>
    this.put(`${this.prefix}/update/${id}`, updates);

  deleteVendor = (id: string) => this.delete(`api/v1/vendor/${id}`);

  updateSponsor = (id: string, updates: any) =>
    this.put(`api/v1/sponsor/${id}`, updates);

  deleteSponsor = (id: string) =>
    this.delete(`api/v1/sponsor/${id}`);
}

export const dashboardService = new DashboardService();
