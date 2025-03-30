import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { UserRole } from "@/types";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  isLoading?: boolean;
}

const RoleSelector = ({ onRoleSelect, isLoading }: RoleSelectorProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
        <CardDescription className="text-center">
          Select how you want to use MessSathi
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center p-6 h-auto"
          onClick={() => onRoleSelect("owner")}
          disabled={isLoading}
        >
          <Building2 className="h-12 w-12 mb-2" />
          <span className="text-lg">Mess Owner</span>
          <span className="text-sm text-muted-foreground mt-1">
            List your mess
          </span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center p-6 h-auto"
          onClick={() => onRoleSelect("tenant")}
          disabled={isLoading}
        >
          <User className="h-12 w-12 mb-2" />
          <span className="text-lg">Tenant</span>
          <span className="text-sm text-muted-foreground mt-1">
            Find a mess
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
