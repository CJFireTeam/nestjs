import { Inject } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";

export class Auth extends UserEntity {
    private UserRepository: Repository<UserEntity>
    
    constructor(repository,data) {
        super();
        this.UserRepository = repository;
        Object.assign(this, data);
    }

    async save() {
        this.roleId = 1;
        console.log(this);
        return await this.UserRepository.save(this);
    }
}
