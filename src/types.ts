export interface IBannerOptions {
  banner_image: string;
  banner_click?: string;
  close_click?: string;
  width?: number;
  height?: number;
  mobile_only?: boolean;
  limit?: number;
  expires?: number;
  action: 'remove' | 'toggle';
  save_state?: boolean;
}
