"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader className="text-center p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-3xl tracking-tight">CropClaim AI</CardTitle>
          <CardDescription className="pt-2">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-0">
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g. John Doe" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="e.g. john@example.com" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" type="submit">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 p-6">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}