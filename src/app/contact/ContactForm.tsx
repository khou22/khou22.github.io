"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const generateFormSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().min(1),
  message: z.string().min(10),
});
type GenerateFormValues = z.infer<typeof generateFormSchema>;

export const ContactForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<GenerateFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid w-full gap-3">
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
      <div className="col-span-2">
        <Textarea
          placeholder="Your message"
          rows={4}
          className="resize-none"
          {...register("message", { required: true })}
        />
      </div>
      <div className="col-span-2 mb-2 mt-2 flex flex-row items-center justify-center">
        <Button type="submit" variant="default" className="min-w-[200px]">
          Send Message
        </Button>
      </div>

      {errors.root && (
        <Alert variant="destructive" className="col-span-2 my-2 w-full">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Submitting Contact</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};
