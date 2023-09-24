import { UserRole } from "src/users/user-role.enum";

export type JwtPayload = {
  sub: string;
  email: string;
  roles: UserRole[];
};
