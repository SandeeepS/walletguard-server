import { Model, type ClientSession } from "mongoose";

export interface IBaseRepository<T> {}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(doc: Partial<T>, session?: ClientSession): Promise<T> {
    const created = await this.model.create([doc], { session });
    if (!created[0]) {
      throw new Error("Failed to create document");
    }
    return created[0] as unknown as T;
  }

  async findOne(
    filter: Partial<T>,
    session?: ClientSession
  ): Promise<T | null> {
    console.log("filter is from BaseRepositoy is ", filter);
    return (await this.model
      .findOne(filter)
      .session(session ?? null)
      .exec()) as T;
  }
}
