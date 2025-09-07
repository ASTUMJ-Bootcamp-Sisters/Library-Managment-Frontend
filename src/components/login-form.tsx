import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FeedbackDialog from "./FeedbackDialog";
// const useAuthStore = require("../store/authStore").default;





export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setIsLoading(true);

    try {
      const { success, error: loginError, user } = await authStore.login(
        formData.email,
        formData.password
      );

      if (success) {
        toast({ title: "Login Successful", description: `Welcome back, ${user.fullName || user.email}!`, variant: "default" });
        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/Dashboard");
        }
      } else {
        setError(loginError || "Login failed");
        toast({ title: "Login Failed", description: loginError || "Login failed", variant: "destructive" });
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast({ title: "Login Error", description: err.message || "Login failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "mx-auto my-16 p-0 md:grid md:grid-cols-2 overflow-hidden shadow-lg",
        className
      )}
      style={{ backgroundColor: "#fdf8f3" }}
      {...props}
    >
      <CardContent className="p-6 md:p-8">
        {/* LEFT SIDE: FORM */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-[#5c4033]">Welcome back</h1>
            <p className="text-[#5c4033]">Login to your account</p>
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
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
              value={formData.password}
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-[#5c4033]">
            New here?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:text-[#e6d5c3]"
            >
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>

      {/* RIGHT SIDE: IMAGE */}
      <div className="relative hidden md:block">
        <img
          src="/loginpic.jpeg"
          alt="Login Illustration"
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
