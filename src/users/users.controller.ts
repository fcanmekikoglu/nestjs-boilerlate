import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "./user-role.enum";
import { AccessTokenGuard } from "src/auth/guards/access-token.guard";
import { GetCurrentUserId } from "src/auth/decorators/get-current-user-id.decorator";
import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Users")
@UseGuards(AccessTokenGuard)
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.USER)
  @Get("me")
  @ApiOperation({ summary: "Get current user's information" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Successfully retrieved user data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getMe(@GetCurrentUserId() userId: string) {
    return await this.usersService.getMe(userId);
  }
}
