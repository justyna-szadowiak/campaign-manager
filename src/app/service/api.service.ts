import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { Campaign, CampaignName, Keyword, Town } from '../interfaces';
import campaigns from '../data/campaigns.json';
import towns from '../data/towns.json';
import keywords from '../data/keywords.json'
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiURL}/campaign`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getCampaigns(): Observable<CampaignName[]> {
    return of(campaigns)
  }

  public saveCampaign(params: Campaign) {
    return this.http.post(baseUrl, params)
  }

  public updateCampaign(id: number, params: Campaign) {
    return this.http.put(`${baseUrl}/${id}`, params)
  }

  public getTowns(): Observable<Town[]> {
    return of(towns)
  }

  public getKeywords(): Observable<Keyword[]> {
    return of(keywords)
  }
}
