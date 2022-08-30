import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs';
import {map, switchMap, startWith, tap} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Campaign } from '../interfaces';
import { AlertsService } from '../service/alerts.service';
import { ApiService } from '../service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-edit-campaign.component.html',
  styleUrls: ['./create-edit-campaign.component.scss']
})
export class CreateEditCampaignComponent implements OnInit {
  public campaign$!: Observable<Campaign>;
  public campaignForm: UntypedFormGroup = this.formBuilder.group({
    name: new UntypedFormControl(''),
    keyword: new UntypedFormControl(''),
    bid: new UntypedFormControl(0.5),
    fund: new UntypedFormControl(''),
    status: new UntypedFormControl(),
    town: new UntypedFormControl(),
    radius: new UntypedFormControl()
  });;
  public towns$: Observable<string[]>;
  public status: boolean = true;
  public submitted: boolean | undefined;
  public isAddMode!: boolean;
  public loading: boolean | undefined;
  public separatorKeyCodes: number[]= [ENTER, COMMA]
  public keyword = new UntypedFormControl('');
  public filteredKeywords$!: Observable<string[]>;
  public keywords: string[] = ['coffee'];
  private userKeyword!: string;

  @ViewChild('keywordInput')
  keywordInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<CreateEditCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) campaign: Campaign,
    public formBuilder: UntypedFormBuilder,
    public API: ApiService,
    public AlertAPI: AlertsService) {
      this.campaignForm.patchValue(campaign);
      this.isAddMode = !campaign;
      this.towns$ = this.API.getTowns();
      this.filteredKeywords$ = this.keyword.valueChanges.pipe(
        startWith(null),
        tap((userKeyword) => {this.userKeyword = userKeyword}),
        switchMap(() => this.API.getKeywords()),
        map((allKeywords: string[]) => this._filter(allKeywords)),
      );
    }

  ngOnInit(): void {
  }

  titleMatch = new ErrorStateMatcher()

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if(value) {
      this.keywords.push(value);
    }

    event.chipInput!.clear();
    this.keyword.setValue(null);
  }

  removeChip(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  selectedKeyword(event: MatAutocompleteSelectedEvent): void {
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

    this.dialogRef.close();
  }
}
