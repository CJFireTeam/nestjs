import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TeamService } from 'src/modules/team/team.service';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(private teamService: TeamService){}
  
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException();
    const activeTeam = await this.teamService.getMyActiveTeam(request.user.me);
    if (!activeTeam)  throw new UnauthorizedException();
    request.team = activeTeam; 
    return true;
  }
}
