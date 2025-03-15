import Role, { IRole } from "../models/Role";
import GenericService from "./GenericService";


class RoleService extends GenericService<IRole> {
    constructor() {
        super(Role);
    }
}

export default new RoleService();