import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Observable, of } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import towns from '../data/towns.json';
import { Campaign, Town } from '../interfaces';
import { AlertsService } from '../service/alerts.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-edit-campaign.component.html',
  styleUrls: ['./create-edit-campaign.component.scss']
})
export class CreateEditCampaignComponent implements OnInit {
  public campaignForm!: FormGroup;
  public towns$: Observable<Town[]> | undefined;
  public keywords$: Observable<string[]> | undefined;
  public radius: number | undefined;
  public status: 'on' | 'off' = 'on'
  public campaign!: Campaign;
  public submitted: boolean | undefined;
  public isAddMode!: boolean;
  public loading: boolean | undefined;
  public separatorKeyCodes: number[]= [ENTER, COMMA]
  public keyword = new FormControl('');
  public filteredKeywords!: Observable<string[]>;
  public keywords: string[] = ['coffee'];
  public allKeywords!: string[];

  @ViewChild('keywordInput')
  keywordInput!: ElementRef<HTMLInputElement>;

  constructor(
    public formBuilder: FormBuilder,
    public API: ApiService,
    public AlertAPI: AlertsService,
    private router: Router,
    private route: ActivatedRoute) {
      this.filteredKeywords = this.keyword.valueChanges.pipe(
        startWith(null),
        map((keyword: string | null) => (keyword ? this._filter(keyword) : this.allKeywords.slice())),
      );
    }

  ngOnInit(): void {
    // this.campaign?.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.campaign?.id

    this.campaignForm = this.formBuilder.group({
      name: new FormControl(''),
      keyword: new FormControl(''),
      bid: new FormControl(0.5),
      fund: new FormControl(''),
      status: new FormControl(),
      town: new FormControl(),
      radius: new FormControl()
    });
  }

  titleMatch = new ErrorStateMatcher()

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if(value) {
      this.keywords.push(value);
    }

    event.chipInput!.clear();

    this.keyword.setValue(null);
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keywords.push(event.option.viewValue);
    this.keywordInput.nativeElement.value = '';
    this.keyword.setValue(null);
  }

  private _filter(value: string): string[] | any {
    const filterValue = value.toLowerCase();

    return this.allKeywords.filter(keyword => keyword.toLowerCase().includes(filterValue))
  }

  onSubmit(){
    this.submitted = true;
    this.AlertAPI.clear();

    if (this.campaignForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createCampaign();
    } else {
      this.updateCampaign();
    }
  }

  createCampaign() {
    this.API.saveCampaign(this.campaignForm.value)
      .pipe(first())
      .subscribe(() => {
        this.AlertAPI.success('New campaign has been added', { keepAfterRouteChange: true});
        this.router.navigate(['../app.component.html'], { relativeTo: this.route});
      })
      .add(() => this.loading = false);
  }

  updateCampaign() {
    const id: number = this.campaign?.id
    this.API.updateCampaign(this.campaign?.id, this.campaignForm.value)
      .pipe(first())
      .subscribe(() => {
        this.AlertAPI.success('The campaign has been updated', {keepAfterRouteChange: true});
        this.router.navigate(['../app.component.html'], { relativeTo: this.route});
      })
      .add(() => this.loading = false);
  }
}
