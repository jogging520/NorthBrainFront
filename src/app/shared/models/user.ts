export class User {
  userName: string;
  roleIds: string[];
  mobiles: string[];
  emails?: string[];
  wechates?: string[];
  affiliations: {
    type?: string;
    organizationId?: string;
  }[] = [{}];
}
