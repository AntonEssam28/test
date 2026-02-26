import { Button, Input, RadioGroup, Radio } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { registerSchema } from "../../../Schema/Register.Schema";
import { sendRegisterData } from "../../../Services/Register.Service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {

  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmitForm(data) {
    try {
      let response = await sendRegisterData(data);
      toast.success(response.message);
      navigate("/auth/login");
    } catch (err) {
      toast.error("Invalid data");
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        Create a new account
      </h2>

      <p className="text-gray-500 mb-6">
        It is quick and easy.
      </p>

      <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">

        <Input {...register("name")} label="Full name" variant="bordered" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <Input {...register("email")} label="Email address" variant="bordered" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Input {...register("password")} type="password" label="Password" variant="bordered" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <Input {...register("rePassword")} type="password" label="Confirm password" variant="bordered" />
        {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}

        <Input {...register("dateOfBirth")} type="date" variant="bordered" />
        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} label="Gender">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </RadioGroup>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}

        <Button isLoading={isSubmitting} type="submit" color="primary">
          Create New Account
        </Button>

      </form>
    </>
  );
}