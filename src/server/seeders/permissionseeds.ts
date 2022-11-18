export const permissionSeeds = [
  { name: 'create-contract', module: 'organization', operationDB: 'create' },
  { name: 'invite-to-organization', module: 'organization', operationDB: 'create' },
  { name: 'create-infrastructure', module: 'organization', operationDB: 'create' },
  { name: 'view-organization-infras', module: 'organization', operationDB: 'create' },
  { name: 'view-organization', module: 'organization', operationDB: 'create' },
  { name: 'update-organization', module: 'organization', operationDB: 'create' },
  { name: 'delete-organization', module: 'organization', operationDB: 'create' },
  { name: 'view-organization-members', module: 'organization', operationDB: 'create' },
  { name: 'view-organization-settings', module: 'organization', operationDB: 'create' },
  { name: 'create-resource', module: 'organization', operationDB: 'create' },
  { name: 'view-organization-infrastructure-list', module: 'organization', operationDB: 'create' },
  //infras permissions
  { name: 'update-infrastructure', module: 'organization', operationDB: 'create' },
  { name: 'delete-infrastructure-resource', module: 'organization', operationDB: 'create' },
  { name: 'update-infrastructure-resources', module: 'organization', operationDB: 'create' },
  { name: 'view-infrastructure', module: 'organization', operationDB: 'create' },
  { name: 'view-infrastructure-resources', module: 'organization', operationDB: 'create' },
  { name: 'view-infrastructure-subInfras', module: 'organization', operationDB: 'create' },
];
