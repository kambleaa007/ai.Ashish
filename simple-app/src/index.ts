// This import will look broken until you run the generation command!
import { components, paths } from './types/api.js';

// 1. Example using the generated User schema type
type User = components['schemas']['User'];

const newUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

console.log(`Created user: ${newUser.name}`);

// 2. Example representing a typed API response path
type GetUsersResponse = paths['/users']['get']['responses']['200']['content']['application/json'];

const sampleResponse: GetUsersResponse = [
  { id: 2, name: "Jane Smith" }
];

console.log(`Fetched ${sampleResponse.length} users successfully.`);
