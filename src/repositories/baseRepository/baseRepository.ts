import { Model, type ClientSession } from "mongoose";
import type { UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {}

//abstract base repository which provides reusable database operations.
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

  async find(filter: Partial<T>, session?: ClientSession): Promise<T[] | null> {
    return (await this.model
      .find(filter)
      .session(session ?? null)
      .exec()) as T[];
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

  async findById(id: any, session?: ClientSession): Promise<T | null> {
    return this.model
      .findById(id)
      .session(session ?? null)
      .exec();
  }

  async findOneAndUpdate(
    filter: Partial<Record<keyof T, any>>,
    update: any,
    session?: ClientSession
  ): Promise<T | null> {
    const options = { session: session ?? null };
    return this.model.findOneAndUpdate(filter as any, update, options).exec();
  }

  async findByIdAndUpdate(
    id: any,
    update: UpdateQuery<T>,
    session?: ClientSession
  ): Promise<T | null> {
    const options = { session: session ?? null };

    return this.model
      .findByIdAndUpdate(id, update, options)
      .exec() as Promise<T | null>;
  }

  async deleteById(id: any, session?: ClientSession): Promise<void> {
    await this.model
      .deleteOne({ _id: id } as any)
      .session(session ?? null)
      .exec();
  }
}
