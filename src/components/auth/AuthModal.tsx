import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  open?: boolean;
  onClose?: () => void;
}

const AuthModal = ({ open = true, onClose = () => {} }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isParent, setIsParent] = useState(true);
  const [parentEmail, setParentEmail] = useState("");
  const [age, setAge] = useState("");
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      onClose();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isParent) {
        await register(email, password, name, "parent");
      } else {
        if (!parentEmail) {
          toast({
            title: "Error",
            description: "Parent email is required for child accounts",
            variant: "destructive",
          });
          return;
        }
        await register(
          email,
          password,
          name,
          "child",
          parentEmail,
          parseInt(age),
        );
      }
      onClose();
      window.location.href = "/dashboard";
      toast({
        title: "Success",
        description: "Registered successfully",
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Learning Dashboard</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Name</Label>
                <Input
                  id="register-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={isParent ? "default" : "outline"}
                    onClick={() => setIsParent(true)}
                  >
                    Parent
                  </Button>
                  <Button
                    type="button"
                    variant={!isParent ? "default" : "outline"}
                    onClick={() => setIsParent(false)}
                  >
                    Child
                  </Button>
                </div>
              </div>
              {!isParent && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="3"
                      max="12"
                      placeholder="Enter child's age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Parent's Email</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      placeholder="Enter parent's email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
