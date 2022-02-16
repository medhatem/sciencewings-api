import { SeedUsers } from './users';
import { generateKCUsers } from './keycloak';

async function main() {
  const users = await generateKCUsers();
  await SeedUsers.createUsers(users);
}

main();
