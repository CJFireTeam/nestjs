import { Inject, Injectable } from '@nestjs/common';
import { IModulesEntity, ModulesEntity } from 'src/entities/modules.entity';
import { IRolesEntity, RolesEntity } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
    constructor(
        @Inject('ROLE_REPOSITORY')
        private readonly roleRepository: Repository<RolesEntity>,
        @Inject('MODULE_REPOSITORY')
        private readonly ModuleRepository: Repository<ModulesEntity>,
    ) {
        this.seedRolesUser();
        this.seedModules();
    }
    //#region  seed roles 
    public  seedRolesUser = async () => {

        /*  
            start seed roles user 
        */
        const rolesUser: IRolesEntity[] = [
            {name:"free",description:"All users",forTeams:false,forUsers:true,isDefault:true,id:1,isPrivate:false,status:true,},
            {name:"premium",description:"All users",forTeams:false,forUsers:true,isDefault:true,id:2,isPrivate:false,status:true},
            {name: "Owner", description: "Team owner",forTeams:true,forUsers:false,isDefault:false,id:3,isPrivate:false,status:true}
        ];

        rolesUser.forEach( async element => {
            const search = await this.roleRepository.findOne({where:{name: element.name}});
            if (!search) {
                this.roleRepository.save(element);
            }
        });

        /*  
            start seed roles user 
        */
    }
    //#endregion seed roles


    public  seedModules = async () => {

        /*  
            start seed roles user 
        */
        const rolesUser: IModulesEntity[] = [
            {
                id: 1,
                name: "Cotizaciones",
                description: "Cotizaciones module",
                forTeams: false,
                forUsers: true,
                isPrivate: false,
                status: true,
                isPremium: false,
            },
            {
                id: 2,
                name: "Caja",
                description: "Caja module",
                forTeams: true,
                forUsers: false,
                isPrivate: false,
                status: true,
                isPremium: false,
            },
            {
                id: 3,
                name: "Inventario",
                description: "Inventario module",
                forTeams: true,
                forUsers: false,
                isPrivate: false,
                status: true,
                isPremium: false,
            },
        ];

        rolesUser.forEach( async element => {
            const search = await this.ModuleRepository.findOne({where:{name: element.name}});
            if (!search) {
                this.ModuleRepository.save(element);
            }
        });

        /*  
            start seed roles user 
        */
    }
}
