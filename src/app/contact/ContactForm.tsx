"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "@/api-clients/ContactFormClient";
import { useState } from "react";
import { classNames } from "@/utils/style";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon/CheckCircleIcon";

const generateFormSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name").max(100),
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Please enter a valid email"),
  subject: z.string().min(2, "Please include a subject").max(50),
  message: z.string().min(20, "Please provide a detailed message").max(1000),
});
type GenerateFormValues = z.infer<typeof generateFormSchema>;

export const ContactForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted, isSubmitting, isSubmitSuccessful },
    setError,
    clearErrors,
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<GenerateFormValues> = async (data) => {
    try {
      await sendContactEmail(
        data.fullName,
        data.email,
        data.subject,
        data.message,
      );
      clearErrors();
    } catch (error) {
      if (error instanceof Error) {
        setError("root", { message: error.message });
      } else {
        setError("root", { message: `Unknown error: ${error}` });
      }
    }
  };

  const formError =
    errors.fullName ||
    errors.email ||
    errors.subject ||
    errors.message ||
    errors.root;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div className="col-span-1">
        <Input
          className="w-full"
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: true })}
        />
      </div>
      <div className="col-span-1">
        <Input
          className="w-full"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>
      <div className="col-span-full">
        <Input
          className="w-full"
          type="subject"
          placeholder="Subject"
          {...register("subject", { required: true })}
        />
      </div>
      <div className="col-span-full">
        <Textarea
          placeholder="Your message"
          rows={4}
          className="resize-none"
          {...register("message", { required: true })}
        />
      </div>
      <div className="col-span-full flex flex-row items-center justify-center">
        <Button
          type="submit"
          variant="default"
          className="min-w-[200px]"
          disabled={isSubmitting || isSubmitSuccessful}
          loading={isSubmitting}
        >
          Send Message
        </Button>
      </div>
      <div className="col-span-full">
        <p
          className={classNames(
            "w-full text-center text-sm text-red",
            isSubmitted && !!formError ? "opacity-100" : "opacity-0",
          )}
        >
          {formError?.message ?? "No Error"}
        </p>
      </div>

      {isSubmitSuccessful && (
        <Alert variant="default" className="col-span-full my-2 w-full">
          <AlertTitle className="flex flex-row items-center justify-start space-x-1">
            <CheckCircleIcon className="h-6 w-6 text-green" />
            <span>Success</span>
          </AlertTitle>
          <AlertDescription>
            Your message was successfully submitted
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};
