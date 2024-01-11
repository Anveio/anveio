"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { CheckCircle2Icon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "./user-context";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email must be in the correct format.",
    })
    .min(3, {
      message: "Email must be at least 3 characters.",
    }),
  password: z.string().min(6, {
    message: "Your password must be at least 6 characters.",
  }),
});

export function LogInForm() {
  const { user, setUser } = useUser();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (user) {
    return (
      <Alert variant="default">
        <CheckCircle2Icon className="h-4 w-4" />
        <AlertTitle>Sign up successful</AlertTitle>
        <AlertDescription>
          You are logged in as {user.email} with ID {user.id}
        </AlertDescription>
      </Alert>
    );
  }

  const handleSubmission = (validatedValues: z.infer<typeof formSchema>) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    const { email, password } = validatedValues;

    formData.append("email", email);
    formData.append("password", password);

    console.log(formData);

    /**
     * Send a fetch request with FormData
     */
    fetch("/api/auth/login/email", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setUser(data);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="relative max-w-xl m-auto space-y-4">
      <motion.div initial={{ opacity: 1, y: 0 }}>
        <Card className="bg-background text-white">
          <CardHeader></CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="log-in-form"
                action="/api/auth/login/email"
                method="post"
                onSubmit={form.handleSubmit(handleSubmission)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          autoComplete={"email"}
                          required
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isSubmitting}
                          autoComplete="new-password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-end">
            <div className="space-x-1">
              <Button variant={"link"} className="text-white">
                Forgot password?
              </Button>

              <Button variant={"default"} type="submit" form="log-in-form">
                Log in
                {isSubmitting ? (
                  <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
