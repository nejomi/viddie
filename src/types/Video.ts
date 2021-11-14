export type Hash =
  | {
      firstTen: string;
      lastTen: string;
    }
  | string;

export interface VideoDetails {
  url: string;
  size: number;
  length: number;
  hash: Hash;
}
