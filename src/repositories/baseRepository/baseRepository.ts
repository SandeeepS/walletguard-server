import { Model } from "mongoose";

export interface IBaseRepository<T> {}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(item: Partial<T>): Promise<T | null> {
    const newItem = new this.model(item);
    await newItem.save();
    return newItem as T;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    console.log("filter is from BaseRepositoy is ", filter);
    return (await this.model.findOne(filter)) as T;
  }
}
