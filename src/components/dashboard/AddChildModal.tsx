import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AddChildModalProps {
  open?: boolean;
  onClose?: () => void;
}

const AddChildModal = ({
  open = false,
  onClose = () => {},
}: AddChildModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const newChildUser = await register(
        email,
        password,
        name,
        "child",
        user?.id, // Pass parent ID directly instead of email
        birthday,
        false, // Don't auto-login as child
      );

      toast({
        title: "Success",
        description: "Child account created successfully",
      });

      onClose();
    } catch (error: any) {
      console.error("Child registration failed:", error);
      setError(error.message || "Registration failed");
      toast({
        title: "Error",
        description: error.message || "Failed to create child account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Child Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child-name">Child's Name</Label>
            <Input
              id="child-name"
              placeholder="Enter child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="child-email">Child's Email</Label>
            <Input
              id="child-email"
              type="email"
              placeholder="Enter child's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="child-password">Password</Label>
            <Input
              id="child-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="child-birthday">Birthday</Label>
            <Input
              id="child-birthday"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                Creating Account...
              </>
            ) : (
              "Add Child Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildModal;
