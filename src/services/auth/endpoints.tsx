import { HttpService } from "../index";

class FormsBaseService extends HttpService {
  // 👇 CRITICAL FIX: Changed "api/v1/..." to "api/forms/..."
  // Also ensured singular/plural matches your backend routes
  private readonly vendorPrefix: string = "api/v1/vendor";
  private readonly sponsorPrefix: string = "api/v1/sponsor";
  private readonly participantPrefix: string = "api/v1/participant";
  private readonly volunteerPrefix: string = "api/v1/volunteer";
// /api/v1/vendor
  /**
   * Vendor Submit API
   * @param data
   */
  submitVendor = (data: FormData): Promise<any> =>
    this.post(this.vendorPrefix, data);

  /**
   * Sponsor Submit API
   * @param data 
   */
  submitSponsor = (data: FormData): Promise<any> =>
    // Headers are handled automatically by the browser/HttpService when passing FormData
    this.post(this.sponsorPrefix, data);

  /**
   * Participant Submit API
   * @param data 
   */
  submitParticipant = (data: any): Promise<any> =>
    this.post(this.participantPrefix, data);

  /**
   * Volunteer Submit API
   * @param data 
   */
  submitVolunteer = (data: any): Promise<any> =>
    this.post(this.volunteerPrefix, data);

  /**
   * Get Sponsors API
   * @param params 
   */
  getSponsors = (params?: any): Promise<any> =>
    this.get(this.sponsorPrefix, params);
}

export const authBaseService = new FormsBaseService();