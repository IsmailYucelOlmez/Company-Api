import GenericService from "./GenericService";
import InternApp, { IInternApp } from './../models/InternApp';


class InternAppService extends GenericService<IInternApp>{

    constructor(){
        super(InternApp)
    }


    async countByUniversity(): Promise<{ [university: string]: number }> {
        const results = await InternApp.aggregate([
            {
                $group: {
                    _id: "$university",
                    count: { $sum: 1 }
                }
            }
        ]);

        return results.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as { [university: string]: number });
    }


    async countByDuration(): Promise<{ [duration: string]: number }> {
        const results = await InternApp.aggregate([
            {
                $group: {
                    _id: "$duration",
                    count: { $sum: 1 }
                }
            }
        ]);

        return results.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as { [duration: string]: number });
    }


    async countByCategory(): Promise<{ [categoryId: string]: number }> {
        const results = await InternApp.aggregate([
            {
                $group: {
                    _id: "$categoryId",
                    count: { $sum: 1 }
                }
            }
        ]);

        return results.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as { [categoryId: string]: number });
    }


    async countByMonth(): Promise<{ [month: string]: number }> {
        const results = await InternApp.aggregate([
            {
                $group: {
                    _id: { $month: "$created_at" }, // Extracts the month from the DateTime field "created_at"
                    count: { $sum: 1 }
                }
            }
        ]);

        return results.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as { [month: string]: number });
    }
}

export default new InternAppService();