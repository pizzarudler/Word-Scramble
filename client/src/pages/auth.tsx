import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false); // Default to registration
  const [, setLocation] = useLocation();
  const { loginMutation, registerMutation, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    if (isLogin) {
      await loginMutation.mutateAsync(data);
    } else {
      await registerMutation.mutateAsync(data);
    }
    setLocation("/");
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen w-full p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-20 animate-gradient" />
      <div className="absolute inset-0 bg-grid-white/10" />

      <div className="relative container mx-auto grid lg:grid-cols-2 gap-8 items-center max-w-6xl pt-16">
        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle>{isLogin ? "Welcome Back!" : "Create Account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Username"
                  {...form.register("username")}
                  disabled={isPending}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...form.register("password")}
                  disabled={isPending}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <p className="text-center mt-4 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="p-0 ml-2"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isPending}
              >
                {isLogin ? "Sign up" : "Log in"}
              </Button>
            </p>
          </CardContent>
        </Card>

        <div className="lg:block hidden text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Word Scramble</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Challenge yourself with word puzzles, track your scores, and compete with others!
          </p>
        </div>
      </div>
    </div>
  );
}