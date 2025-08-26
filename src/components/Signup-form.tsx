import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn("mx-auto my-16 p-0 md:grid md:grid-cols-2 overflow-hidden shadow-lg", className)}
      style={{ backgroundColor: "#fdf8f3" }}
      {...props}
    >
      <CardContent className="p-6 md:p-8">
        {/* Left Side: Form */}
        <form className="flex flex-col gap-6">
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
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username" className="text-[#5c4033]">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              required
              className="border-[#5c4033] focus:border-[#5c4033] focus:ring-[#5c4033]"
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
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5c4033] hover:bg-[#e6d5c3] text-white"
          >
            Sign Up
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
    </Card>
  );
}
