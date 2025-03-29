import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import { auth, storage, db, functions } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from "firebase/functions";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("tenant");
  const [isMinor, setIsMinor] = useState(false);
  const [aadharFiles, setAadharFiles] = useState<File[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    parentName: "",
    parentPhone: "",
    parentEmail: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!formData.phone) {
      toast.error("Please enter your phone number.");
      return;
    }

    try {
      const sendOtpFunction = httpsCallable(functions, "sendOtp");
      await sendOtpFunction({ phoneNumber: formData.phone });
      toast.success("OTP sent to your phone.");
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const verifyOtpFunction = httpsCallable(functions, "verifyOtp");
      await verifyOtpFunction({ phoneNumber: formData.phone, code: otp });
      toast.success("Phone number verified.");
      setOtpVerified(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error("Please verify your phone number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (aadharFiles.length === 0) {
      toast.error("Please upload your Aadhar card");
      return;
    }

    if (isMinor && (!formData.parentName || !formData.parentPhone)) {
      toast.error("Please provide parent details");
      return;
    }

    setIsLoading(true);

    try {
      // Create auth user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Upload Aadhar files
      const aadharUrls = await Promise.all(
        aadharFiles.map(async (file) => {
          const fileRef = ref(storage, `aadhar/${user.uid}/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: userRole,
        aadharVerified: false,
        aadharUrls,
        isMinor: isMinor,
        parentDetails: isMinor ? {
          name: formData.parentName,
          phone: formData.parentPhone,
          email: formData.parentEmail
        } : null,
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully");
      navigate(userRole === "owner" ? "/mess-owner-dashboard" : "/tenant-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join MessSathi and find the perfect mess for your college life
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="tenant"
                  onClick={() => setUserRole("tenant")}
                >
                  I'm a Tenant
                </TabsTrigger>
                <TabsTrigger
                  value="owner"
                  onClick={() => setUserRole("owner")}
                >
                  I'm a Mess Owner
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
                {!otpSent ? (
                  <Button onClick={sendOtp}>Send OTP</Button>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button onClick={verifyOtp}>Verify OTP</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhar">Upload Aadhar Card</Label>
              <FileUpload
                label="Upload Aadhar Card"
                onChange={setAadharFiles}
                multiple={false}
                accept="image/*,.pdf"
              />
            </div>

            {userRole === "tenant" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="minor"
                    checked={isMinor}
                    onCheckedChange={setIsMinor}
                  />
                  <Label htmlFor="minor">I am under 18 years of age</Label>
                </div>

                {isMinor && (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium">Parent/Guardian Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent's Name</Label>
                      <Input
                        id="parentName"
                        name="parentName"
                        placeholder="Enter parent's name"
                        required={isMinor}
                        value={formData.parentName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Parent's Phone Number</Label>
                      <Input
                        id="parentPhone"
                        name="parentPhone"
                        placeholder="Enter parent's phone number"
                        required={isMinor}
                        value={formData.parentPhone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">Parent's Email (optional)</Label>
                      <Input
                        id="parentEmail"
                        name="parentEmail"
                        type="email"
                        placeholder="Enter parent's email"
                        value={formData.parentEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-messsathi-orange hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-messsathi-blue hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
