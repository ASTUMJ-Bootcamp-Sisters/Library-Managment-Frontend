import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore.js";
// const useAuthStore = require("../store/authStore").default;
import FeedbackDialog from "./FeedbackDialog";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const authStore = useAuthStore();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const { success, error: registerError } = await authStore.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        toast({ title: "Signup Successful", description: `Welcome, ${formData.fullName || formData.email}!`, variant: "default" });
        navigate("/Dashboard"); // Redirect to dashboard on success
      } else {
        setError(registerError || "Registration failed");
        toast({ title: "Signup Failed", description: registerError || "Registration failed", variant: "destructive" });
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast({ title: "Signup Error", description: err.message || "Registration failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn("mx-auto my-16 p-0 md:grid md:grid-cols-2 overflow-hidden shadow-lg", className)}
      style={{ backgroundColor: "#fdf8f3" }}
      {...props}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.png"
            alt="logo"
            className="w-20 "
            />
          </div>
        {/* Left Side: Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-[#5c4033]">Create an account</h1>
            <p className="text-[#5c4033]">Sign up to get started</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName" className="text-[#5c4033]">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-[#5c4033]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-[#5c4033]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-[#5c4033]">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#5c4033] hover:bg-[#e6d5c3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-[#5c4033]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-[#e6d5c3]"
            >
              Login
            </Link>
          </div>
        </form>
      </CardContent>

      {/* Right Side: Image */}
      <div className="relative hidden md:block">
        <img
          src="/signUppic.jpeg"
          alt="Signup Illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <FeedbackDialog />
      </div>
    </Card>
  );
}
