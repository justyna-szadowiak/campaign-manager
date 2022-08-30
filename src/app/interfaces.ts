export interface Campaign {
  id: number;
  name: string;
  keyword: string;
  bid: number;
  fund: number;
  status: boolean;
  town: string;
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
