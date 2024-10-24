import { IMetadata } from './metadata.interface';

export interface ISuccessResponse<T> {
  data: T;
  metadata: IMetadata;
  status?: number;
  message?: string;
  userMessage?: string;
}
