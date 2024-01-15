"use client";

import {
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const UserForm = ({ type, data }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/chats')
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });


  const onSubmit = async (data) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/");
      }

      if (res.error) {
        toast.error("Something went wrong");
      }
    }

    if (type === "login") {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res.ok) {
        router.push("/chats");
      }

      if (res.error) {
        toast.error("Invalid credentials!");
      }
    }
  };

  const signInWithGoogle = async () => {
    signIn("google", { redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error("Invalid credentials!");
      }

      if (callback?.ok) {
        router.push("/chats");
      }
    });
  };

  return (
    <div className="auth">
      <div className="content">
        <img src="/assets/logo.png" alt="logo" className="logo" />

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <>
              <div className="input">
                <input
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) => {
                      if (value.length < 2) {
                        return "Username must be more than 1 character";
                      }
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutlined sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-1">{errors.username.message}</p>
              )}
            </>
          )}

          <div className="error">
            <div className="input">
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="input">
              <input
                {...register("password", {
                  required: "Password is required",
                  // validate: (value) => {
                  //   if (value.length < 5 || !value.match(/[^a-zA-Z0-9]/g)) {
                  //     return "Password must be more than 5 characters and contain at least 1 special";
                  //   }
                  // },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-1 max-w-80">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="button">
            {type === "register" ? "Join Free" : "Let's Chat"}
          </button>
        </form>

        <p>----- Or continue -----</p>

        <button className="button" onClick={() => signInWithGoogle()}>
          Sign In with Google{" "}
        </button>

        {type === "register" ? (
          <Link href="/login" className="link">
            Already have an account? Sign In Here
          </Link>
        ) : (
          <Link href="/register" className="link">
            Don't have an account? Register Here
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserForm;
