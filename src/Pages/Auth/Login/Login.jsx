import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../../Schema/Login.Schema";
import { sendLoginData } from "../../../Services/Login.Service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tokenContext } from "../../../Context/tokenContext";

export default function Login() {

  let { setToken } = useContext(tokenContext);
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmitForm(data) {
    try {
      let response = await sendLoginData(data);
      toast.success(response.message);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        Log in to Route Posts
      </h2>

      <p className="text-gray-500 mb-6">
        Log in and continue your social journey.
      </p>

      <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">

        <Input
          {...register("email")}
          label="Email or username"
          variant="bordered"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Input
          {...register("password")}
          label="Password"
          type="password"
          variant="bordered"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <Button isLoading={isSubmitting} type="submit" color="primary">
          Log In
        </Button>

        <p className="text-center text-sm text-blue-700 cursor-pointer">
          Forgot password?
        </p>

      </form>
    </>
  );
}