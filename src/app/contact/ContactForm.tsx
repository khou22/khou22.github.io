"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email" className="mb-1 block leading-5">
        Email
      </label>
      <input
        id="email"
        type="email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <p className="text-red text-sm">{errors.email.message}</p>
      )}
      <label htmlFor="message" className="mb-1 block leading-5">
        Message
      </label>
      <textarea {...register("message", { required: true })} />
      {errors.message && (
        <p className="text-red text-sm">{errors.message.message}</p>
      )}
    </form>
  );
};
