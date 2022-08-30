import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { Campaign, CampaignName } from '../interfaces';
import campaigns from '../data/campaigns.json';
import towns from '../data/towns.json';
import keywords from '../data/keywords.json';
import campaignInfo from '../data/campaignInfo.json';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiURL}`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getCampaigns(): Observable<CampaignName[]> {
    return of(campaigns)
  }

  public getCampaignById(id: number): Observable<Campaign> {
    return of(campaignInfo.find(campaignInfo => campaignInfo.id === id) as Campaign)
  }

  public getTowns(): Observable<string[]> {
    return of(towns)
  }

  public getKeywords(): Observable<string[]> {
    return of(keywords)
  }
}
