import { UserService } from './user.service';
import { User } from './user.service.interface';

/**
 * Delegating fake service.
 * Overrides only the resources, all methods come from original UserService.
 */
export class UserServiceFake extends UserService {
  constructor() {
    super();

    // --- Mock GET ---
    this.getResource = { load: async (): Promise<User[]> => [
      { id: 1, name: 'Fake Alice', password: 'xxx' },
      { id: 2, name: 'Fake Bob', password: 'yyy' },
    ]};

    // --- Mock POST ---
    this.postResource = { load: async (user: User): Promise<User> => ({
      ...user,
      id: Math.floor(Math.random() * 1000),
    })};

    // --- Mock PUT ---
    this.putResource = { load: async (user: User): Promise<User> => user };

    // --- Mock PATCH ---
    this.patchResource = { load: async (input: { id: number; patch: Partial<User> }): Promise<User> => {
      const existing = this.usersData.find(u => u.id === input.id);
      return existing ? { ...existing, ...input.patch } : { id: input.id, name: '', password: '' };
    }};

    // --- Mock DELETE ---
    this.deleteResource = { load: async (): Promise<{ success: true }> => ({ success: true }) };
  }
}
######

import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { UserServiceFake } from './user.service.fake';
import { User } from './user.service.interface';

describe('UserServiceFake (delegating)', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserServiceFake,
        { provide: UserService, useExisting: UserServiceFake },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should load fake users', async () => {
    const users = await service.loadUsers();
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('Fake Alice');
    expect(service.users().length).toBe(2); // signals updated
  });

  it('should add a new user', async () => {
    await service.addUser({ id: 0, name: 'Charlie', password: 'zzz' });
    const users = service.users();
    expect(users.some(u => u.name === 'Charlie')).toBeTrue();
  });

  it('should update an existing user', async () => {
    const users = await service.loadUsers();
    const user = users[0];
    user.name = 'Alice Updated';
    await service.updateUser(user);

    const updated = service.getUser(user.id);
    expect(updated?.name).toBe('Alice Updated');
    expect(service.users().some(u => u.name === 'Alice Updated')).toBeTrue();
  });

  it('should patch a user', async () => {
    const users = await service.loadUsers();
    const user = users[0];
    await service.patchUser(user.id, { password: 'newpass' });

    const patched = service.getUser(user.id);
    expect(patched?.password).toBe('newpass');
  });

  it('should delete a user', async () => {
    const users = await service.loadUsers();
    const user = users[0];
    await service.deleteUser(user.id);

    const deleted = service.getUser(user.id);
    expect(deleted).toBeUndefined();
    expect(service.users().some(u => u.id === user.id)).toBeFalse();
  });

  it('should handle multiple operations together', async () => {
    await service.loadUsers();

    await service.addUser({ id: 0, name: 'Delta', password: 'abc' });
    let delta = service.users().find(u => u.name === 'Delta');
    expect(delta).toBeDefined();

    delta!.name = 'Delta Updated';
    await service.updateUser(delta!);
    expect(service.getUser(delta!.id)?.name).toBe('Delta Updated');

    await service.patchUser(delta!.id, { password: 'patchedpass' });
    expect(service.getUser(delta!.id)?.password).toBe('patchedpass');

    await service.deleteUser(delta!.id);
    expect(service.getUser(delta!.id)).toBeUndefined();
  });

  it('should get user by id', async () => {
    const users = await service.loadUsers();
    const user = service.getUser(users[0].id);
    expect(user).toBeDefined();
    expect(user?.name).toBe('Fake Alice');
  });

  it('should not fail if patching non-existent user', async () => {
    await service.patchUser(999, { name: 'Ghost' });
    const ghost = service.getUser(999);
    expect(ghost).toBeDefined();
    expect(ghost?.name).toBe('Ghost');
  });

  it('should not fail if deleting non-existent user', async () => {
    await service.deleteUser(999);
    expect(service.users().length).toBe(2); // only fake initial users
  });
});