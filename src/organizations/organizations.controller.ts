import { Controller, Patch, Param, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Patch('switch/:organizationId')
  async switchOrganization(
    @Param('organizationId') organizationId: string,
    @Req() req: any,
  ) {
    return this.organizationsService.switchOrganization(
      req.user.sub,
      organizationId,
    );
  }
}