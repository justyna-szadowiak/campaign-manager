import { Component, Input, OnInit } from '@angular/core';
import { Campaign, CampaignName } from '../interfaces';
import { ApiService } from '../service/api.service';
import {MatDialog} from '@angular/material/dialog';
import { CreateEditCampaignComponent } from '../create-edit-campaign/create-edit-campaign.component';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  public campaigns: CampaignName[] | undefined;
  public currentCampaign: Campaign | undefined;

  constructor(
    public API: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.API.getCampaigns().subscribe((res) => {
      console.log(res)
      this.campaigns = res
    })
  }

  updateCampaign(id: number){
    const dialogRefUpdate = this.dialog.open(CreateEditCampaignComponent, {
      data: id,
      width: '600px'
    });
  }

  createCampaign(){
    const dialogRefCreate = this.dialog.open(CreateEditCampaignComponent, {
      data: this.currentCampaign,
      width: '600px'
    });

    dialogRefCreate.afterClosed().subscribe(() => {
    })
  }

  deleteCampaign(){
    if (this.campaigns?.find(elem => elem.name === elem.name)) {
      this.campaigns.splice(this.campaigns.findIndex(elem => elem.name === elem.name), 1);
    }
  }
}
