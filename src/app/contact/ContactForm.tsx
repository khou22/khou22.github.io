"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormLabel } from "@/components/atoms/FormLabel/FormLabel";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

const generateFormSchema = z.object({
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
      email: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<GenerateFormValues> = async (data) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FormLabel htmlFor="email">Email</FormLabel>
      <TextInput type="email" {...register("email", { required: true })} />
      {errors.email && (
        <p className="text-red text-sm">{errors.email.message}</p>
      )}
      <FormLabel htmlFor="message">Message</FormLabel>
      <TextArea rows={4} {...register("message", { required: true })} />
      {errors.message && (
        <p className="text-red text-sm">{errors.message.message}</p>
      )}
    </form>
  );
};
