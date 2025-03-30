import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth, db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserRole } from "@/types";
import RoleSelector from "@/components/RoleSelector";
import MessOwnerSignup from "@/components/MessOwnerSignup";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    aadharNumber: "",
    panNumber: "",
  });

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      toast.error("Please verify your phone number first");
      return;
    }

    try {
      setIsLoading(true);

      // Create user document with role and business details
      await setDoc(doc(db, 'users', auth.currentUser!.uid), {
        uid: auth.currentUser!.uid,
        name: formData.name,
        email: auth.currentUser!.email,
        phone: formData.phone,
        phoneVerified: true,
        role: selectedRole,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success("Registration successful!");
      navigate(selectedRole === "owner" ? "/mess-owner-dashboard" : "/tenant-dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4">
      {!selectedRole ? (
        <RoleSelector onRoleSelect={handleRoleSelect} isLoading={isLoading} />
      ) : selectedRole === "owner" ? (
        <MessOwnerSignup
          formData={formData}
          handleChange={handleInputChange}
          isLoading={isLoading}
          onPhoneVerified={setPhoneVerified}
        />
      ) : (
        // Tenant signup form
        <div>Tenant signup form</div>
      )}
    </div>
  );
};

export default Signup;
