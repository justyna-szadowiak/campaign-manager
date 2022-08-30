import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Observable, of } from 'rxjs';
import {map, switchMap, startWith, tap} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Campaign } from '../interfaces';
import { AlertsService } from '../service/alerts.service';
import { ApiService } from '../service/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-edit-campaign.component.html',
  styleUrls: ['./create-edit-campaign.component.scss']
})
export class CreateEditCampaignComponent implements OnInit {
  public campaign$!: Observable<Campaign>;
  public campaignForm!: FormGroup;
  public towns$: Observable<string[]>;
  public radius: number | undefined;
  public status: boolean = true;
  public campaign!: Campaign;
  public submitted: boolean | undefined;
  public isAddMode!: boolean;
  public loading: boolean | undefined;
  public separatorKeyCodes: number[]= [ENTER, COMMA]
  public keyword = new FormControl('');
  public filteredKeywords$!: Observable<string[]>;
  public keywords: string[] = ['coffee'];
  private userKeyword: string | null = null

  @ViewChild('keywordInput')
  keywordInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    public formBuilder: FormBuilder,
    public API: ApiService,
    public AlertAPI: AlertsService,
    private router: Router,
    private route: ActivatedRoute) {
      const allKeywords$ = this.API.getKeywords();
      this.towns$ = this.API.getTowns();
      this.campaign$ = this.API.getCampaignById(id);
      this.filteredKeywords$ = this.keyword.valueChanges.pipe(
        startWith(null),
        tap((userKeyword) => {this.userKeyword = userKeyword}),
        switchMap(() => allKeywords$),
        map((allKeywords: string[]) => this._filter(allKeywords)),
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

  private _filter(allKeywords: string[]): string[] | any {
    if(this.userKeyword !== null) {
      return allKeywords.filter(keyword => keyword.toLowerCase().includes((this.userKeyword as string).toLowerCase()))
    }

    return allKeywords;
  }

  onSubmit(){
    this.submitted = true;
    this.AlertAPI.clear();

    if (this.campaignForm.invalid) {
      return;
    }

    // this.loading = true;
    // if (this.isAddMode) {
    //   this.createCampaign();
    // } else {
    //   this.editCampaign();
    // }
  }

  // createCampaign() {
  //   this.API.saveCampaign(this.campaignForm.value)
  //     .pipe(first())
  //     .subscribe(() => {
  //       this.AlertAPI.success('New campaign has been added', { keepAfterRouteChange: true});
  //       this.router.navigate(['/app'], { relativeTo: this.route});
  //     })
  //     .add(() => this.loading = false);
  // }

  // editCampaign() {
  //   const id: number = this.campaign?.id
  //   this.API.updateCampaign(this.campaign?.id, this.campaignForm.value)
  //     .pipe(first())
  //     .subscribe(() => {
  //       this.AlertAPI.success('The campaign has been updated', {keepAfterRouteChange: true});
  //       this.router.navigate(['/app'], { relativeTo: this.route});
  //     })
  //     .add(() => this.loading = false);
  // }
}
