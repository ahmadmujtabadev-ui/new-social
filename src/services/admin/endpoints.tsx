// src/services/auth/endpoints.ts
import { HttpService } from "../index";

class AuthBaseService extends HttpService {
  private readonly authPrefix: string = "api/v1/user";

  login = (data: { email: string; password: string }): Promise<any> =>
    this.post(`${this.authPrefix}/login`, data);
}

export const authBaseService = new AuthBaseService();
