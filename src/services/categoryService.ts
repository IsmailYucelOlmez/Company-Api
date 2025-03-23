import GenericService from "./GenericService";
import Category, { ICategory } from './../models/Category';


class CategoryService extends GenericService<ICategory>{

    constructor(){
        super(Category)
    }
}

export default new CategoryService();