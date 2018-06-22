export class Organization {
  organizationId?: string;
  code?: string;
  name?: string;
  regionId?: string;
  parent?: string;
  children?: Organization[] = [{}];
}
