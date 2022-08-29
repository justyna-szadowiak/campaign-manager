export interface Town {
  id: number;
  town: string;
}

export interface CampaignName {
  id: number;
  name: string;
}

export interface CampaignInfo extends CampaignName {
  keyword: string
}

export interface Campaign extends CampaignName, Town {
  keyword: string;
  bid_amount: number;
  fund: number;
  status: string;
  radius: number;
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}

export interface Alert {
  id: number,
  type: AlertType,
  message: string,
  autoClose: boolean,
  keepAfterRouteChange: boolean,
  fade: boolean
}
