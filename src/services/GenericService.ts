import { Model } from "mongoose";

class GenericService<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(): Promise<T[] | null> {
        return await this.model.find();
    }

    async getById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
        const modelData=new this.model(data);
        await modelData.save()
        
        return modelData
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }
}

export default GenericService;
