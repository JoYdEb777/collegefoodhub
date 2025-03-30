import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface OwnerProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onUpdate: () => void;
}

const OwnerProfileDialog = ({ isOpen, onClose, userData, onUpdate }: OwnerProfileDialogProps) => {
  const { updateUserData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    businessName: userData?.businessName || "",
    businessAddress: userData?.businessAddress || "",
    aadharNumber: userData?.aadharNumber || "",
    panNumber: userData?.panNumber || "",
    description: userData?.description || ""
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        businessName: userData.businessName || "",
        businessAddress: userData.businessAddress || "",
        aadharNumber: userData.aadharNumber || "",
        panNumber: userData.panNumber || "",
        description: userData.description || ""
      });
    }
  }, [isOpen, userData]);

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.businessName || !formData.businessAddress) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid Indian phone number");
      return false;
    }

    // Validate Aadhar number if provided
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return false;
    }

    // Validate PAN number if provided
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      toast.error("Please enter a valid PAN number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // Update both user document and mess document if it exists
      await Promise.all([
        updateDoc(doc(db, 'users', userData.uid), updateData),
        updateUserData(updateData)
      ]);

      // If there's a mess document, update owner details there too
      const messRef = doc(db, 'messes', userData.uid);
      const messDoc = await getDoc(messRef);
      if (messDoc.exists()) {
        await updateDoc(messRef, {
          ownerName: formData.name,
          businessName: formData.businessName,
          businessDescription: formData.description,
          updatedAt: new Date().toISOString()
        });
      }

      toast.success("Profile updated successfully!");
      await onUpdate(); // Wait for the update to complete
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Business Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Owner Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your mess business..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-messsathi-orange hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerProfileDialog;
