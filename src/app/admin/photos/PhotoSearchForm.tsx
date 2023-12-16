"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import React from "react";

const generateFormSchema = z.object({
  query: z.string().min(1),
});
type GenerateFormValues = z.infer<typeof generateFormSchema>;

type PhotoSearchFormProps = {
  initialValue?: string;
};

export const PhotoSearchForm: React.FC<PhotoSearchFormProps> = ({
  initialValue = "",
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",
    defaultValues: {
      query: initialValue,
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<GenerateFormValues> = async (data) => {
    router.push(PAGES.ADMIN.SEARCH(data.query));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex w-full flex-row items-center justify-center space-x-2">
        <Input
          className="grow"
          type="text"
          placeholder="Search Query"
          {...register("query", { required: true })}
        />
        <Button type="submit" variant="default" className="grow-0">
          Search
        </Button>
      </div>
      <p
        className={classNames(
          "mt-2 text-sm text-red",
          errors.query ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {errors.query?.message || ""}
      </p>

      {errors.root && (
        <Alert variant="destructive" className="col-span-2 my-2 w-full">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Searching Photo</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};
