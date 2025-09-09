import { AffiliateInfo, AffiliateInput } from "@/app/common/types/affiliate";
import { RequestOptions } from "@/app/common/types/common";

class AffiliateService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/auth/admin") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string = "",
    options: RequestOptions = {}
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorBody;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      const err = new Error(`Erreur API Next: ${res.status}`);
      (err as any).status = res.status;
      (err as any).body = errorBody;
      throw err;
    }

    return res.json() as Promise<T>;
  }

  getAffiliates(): Promise<AffiliateInfo[]> {
    return this.request("/");
  }

  createAffiliate(data: AffiliateInput) {
    return this.request("/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const affiliateService = new AffiliateService();
