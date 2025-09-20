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
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle account creation logic here
    console.log("Form submitted");
    router.push('/dashboard');
  };

  return (
    <main 
      className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/seed/forest/1920/1080')" }}
      data-ai-hint="forest path"
    >
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-md shadow-lg rounded-xl z-10 animate-fade-in-up">
        <CardHeader className="text-center p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-3xl tracking-tight">CropClaim AI</CardTitle>
          <CardDescription className="pt-2">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardFooter className="flex-col gap-4 px-6 pb-6 pt-4">
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
