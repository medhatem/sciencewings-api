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
  { name: 'view-organization-projects', module: 'organization', operationDB: 'create' },
  { name: 'create-project', module: 'organization', operationDB: 'create' },
  { name: 'view-organization-project-list', module: 'organization', operationDB: 'create' },

  // project permissions
  { name: '{orgId}-view-organization-project', module: 'organization', operationDB: 'create' },
  { name: '{orgId}-update-project', module: 'organization', operationDB: 'create' },
  { name: 'create-project-members', module: 'organization', operationDB: 'create' },
  { name: 'view-project-participants', module: 'organization', operationDB: 'create' },
  { name: 'update-project-participants', module: 'organization', operationDB: 'create' },
];
