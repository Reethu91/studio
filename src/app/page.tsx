
"use client"
import { Button } from "@/components/ui/button";
import { Leaf, MoveRight } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://picsum.photos/seed/welcome/1920/1080')" }}
      data-ai-hint="lush landscape"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="z-10 text-center animate-fade-in-up flex flex-col items-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary mb-6 border-4 border-primary-foreground/50">
          <Leaf className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight">
          Welcome to CropClaim AI
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/80">
          Streamlining crop insurance claims with the power of AI. Get instant damage analysis and faster compensation.
        </p>
        <Link href="/login" passHref>
          <Button size="lg" className="mt-8 text-lg h-12 group">
            Get Started
            <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
