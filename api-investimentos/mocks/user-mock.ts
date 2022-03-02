import { Users } from "../src/models/users.model";

export class UsersMock {
  private users = [];

  async create(data): Promise<Users> {
    const user = new Users();

    Object.assign(user, { id: this.users.length + 1, name: data.name });

    this.users.push(user);

    return user;
  }

  async findOne(data): Promise<Users | undefined> {
    if (data.where.name) {
      const user = this.users.find(
        (user) => user.name === data.where.name,
      );

      return user;
    }
   
  }

  
}
