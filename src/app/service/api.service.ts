import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { Campaign } from '../interfaces';
import towns from '../data/towns.json';
import keywords from '../data/keywords.json';
import campaignInfo from '../data/campaignInfo.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public getCampaigns(): Observable<Campaign[]> {
    return of(campaignInfo)
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
