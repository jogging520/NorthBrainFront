export class User {
  id: string;
  type: string;
  userName: string;
  password: string;
  realName: string;
  avatar?: string;
  appTypes: string[];
  roleIds: string[];
  permissionIds?: number[];
  affiliations: {
    type?: string;
    organizationId?: string;
  }[] = [{}];
  mobiles: string[];
  emails?: string[];
  wechates?: string[];
}
