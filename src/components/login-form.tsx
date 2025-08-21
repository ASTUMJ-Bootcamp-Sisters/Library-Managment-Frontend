import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-white shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* LEFT SIDE: FORM */}
          <form className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Login to your account
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full">Login</Button>

            <div className="text-center text-sm">
              New here?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Create an account
              </Link>
            </div>
          </form>

          {/* RIGHT SIDE: IMAGE */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://unsplash.com/photos/white-printer-paper-beside-black-computer-mouse-mY9NpmCwwKE"
              alt="Login Illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
