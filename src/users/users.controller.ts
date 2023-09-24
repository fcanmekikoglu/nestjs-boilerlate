import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/auth/decorators/get-current-user-id.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AccessTokenGuard } from "src/auth/guards/access-token.guard";
import { UserRole } from "./user-role.enum";
import { UsersService } from "./users.service";

@UseGuards(AccessTokenGuard)
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.USER)
  @ApiOperation({ summary: "Get current user's information" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Successfully retrieved user data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @Get("me")
  async getMe(@GetCurrentUserId() userId: string) {
    return await this.usersService.getMe(userId);
  }
}
