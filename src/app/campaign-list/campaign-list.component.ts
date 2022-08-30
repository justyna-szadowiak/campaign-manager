import { Component, OnInit } from '@angular/core';
import { Campaign } from '../interfaces';
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditCampaignComponent } from '../create-edit-campaign/create-edit-campaign.component';
import { BehaviorSubject, filter, take } from 'rxjs';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  public campaigns$: BehaviorSubject<Campaign[]> = new BehaviorSubject<Campaign[]>([]);
  public currentCampaign: Campaign | undefined;

  constructor(
    public API: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.API.getCampaigns()
      .pipe(take(1))
      .subscribe((campaign) => {
        this.campaigns$.next(campaign)
      })
  }

  updateCampaign(campaign: Campaign, index: number){
    const dialogRefUpdate = this.dialog.open(CreateEditCampaignComponent, {
      data: campaign,
      width: '600px'
    });

    dialogRefUpdate
      .afterClosed()
      .pipe(take(1))
      .subscribe((cmp) => {
        if (cmp) {
          this.campaigns$.asObservable().pipe(take(1)).subscribe(campaigns => {
            campaigns[index] = cmp;
            this.campaigns$.next(campaigns)
          })
        }
      });
  }

  createCampaign(){
    const dialogRefCreate = this.dialog.open(CreateEditCampaignComponent, {
      data: this.currentCampaign,
      width: '600px'
    });

    dialogRefCreate
      .afterClosed()
      .pipe(take(1))
      .subscribe((cmp) => {
        if (cmp) {
          this.campaigns$.asObservable().pipe(take(1)).subscribe(campaigns => {
            cmp.id = campaigns[campaigns.length - 1].id + 1
            campaigns.push(cmp);
            this.campaigns$.next(campaigns)
          })
        }
      });
  }

  deleteCampaign(id: number){
    this.campaigns$.asObservable().pipe(take(1)).subscribe(campaigns => {
      this.campaigns$.next(campaigns.filter(cmp => cmp.id !== id))
    })
  }
}
