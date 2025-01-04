import { Expose } from 'class-transformer';

export class LoggedAuthorRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
}
