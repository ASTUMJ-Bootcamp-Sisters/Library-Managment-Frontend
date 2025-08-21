import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Side: Form */}
          <form className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-balance text-muted-foreground">
                Sign up to get started
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" placeholder="John Doe" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="johndoe" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm password</Label>
              <Input id="password" type="password" placeholder="Confirm password" required />
            </div>

            <Button type="submit" className="w-full">Sign Up</Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">Login</a>
            </div>
          </form>

          {/* Right Side: Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signUppic.jpeg"
              alt="Signup Illustration"
              className="absolute inset-0 h-full w-full object-cover  "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
