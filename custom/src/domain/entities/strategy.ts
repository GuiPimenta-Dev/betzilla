export interface Strategy {
  name: string;
  bet(arg: any): boolean;
}
