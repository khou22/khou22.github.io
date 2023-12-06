"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { TextInput } from "@/components/atoms/TextInput/TextInput";
import Button from "@/components/atoms/Button/Button";

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
        <TextInput
          className="w-full"
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: true })}
        />
      </div>
      <div className="col-span-1">
        <TextInput
          className="w-full"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>
      <div className="col-span-2">
        <TextArea
          placeholder="Your message"
          rows={4}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="text-red text-sm">{errors.message.message}</p>
        )}
      </div>
      <div className="col-span-2 mb-2 mt-4 flex flex-row items-center justify-center">
        <Button type="submit" className="min-w-[200px]">
          Send Message
        </Button>
      </div>
    </form>
  );
};
