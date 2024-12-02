import { Eye, LibraryBig, Loader2, User } from "lucide-react";
import robotJson from "@/assets/lottie/robot.json";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/stores/authStore";
import { stat } from "fs";
import Lottie from "lottie-react";

const LoginModal = () => {
  const [passVisible, setPassVisible] = useState(false);
  const initialFormState = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(initialFormState);
  const navigate = useNavigate();
  // async function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch(`/api/auth/login`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email: form.email,
  //         password: form.password,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (data) {
  //       toast(data.message);
  //       if (response.ok) {
  //         setForm(initialFormState);
  //         // set zustand state later
  //         navigate("/dashboard");
  //       }
  //     }
  //   } catch (error) {
  //     toast("An error occurred", {
  //       icon: "❌",
  //     });
  //   }
  // }
  const login = useAuth((state) => state.login);
  async function handleLogin() {
    try {
      await login(form.email, form.password);
      navigate("/subjects");
    } catch (error) {
      toast("An error occurred", {
        icon: "❌",
      });
    }
  }
  const { refetch, isFetching } = useQuery("login", handleLogin, {
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Login</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Log into your account to access all the features.
        </DialogDescription>
        <form>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              value={form.email}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, email: event.target.value }));
              }}
              id="email"
              type="email"
              placeholder="Email"
            />

            <div className="relative">
              <Label htmlFor="email">Password</Label>

              <Input
                value={form.password}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
                type={passVisible ? "text" : "password"}
                placeholder="Password"
              />
              <button
                onClick={() => {
                  setPassVisible((prev) => !prev);
                }}
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Eye className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Button
              onClick={(event) => {
                event.preventDefault();
                refetch();
              }}
            >
              {isFetching ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RegisterModal = () => {
  const initialFormState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    parent_involvement: false,
    distance_from_home: "0" as "0" | "1" | "2",
    sleep_hours: 0,
    motivation_level: "0" as "0" | "1" | "2",
    internet_access: false,
    school_type: "0" as "0" | "1",
    gender: "0" as "0" | "1",
    learning_disability: false,
  };
  const [form, setForm] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    parent_involvement: boolean;
    distance_from_home: "0" | "1" | "2";
    sleep_hours: number;
    motivation_level: "0" | "1" | "2";
    internet_access: boolean;
    school_type: "0" | "1";
    gender: "0" | "1";
    learning_disability: boolean;
  }>(initialFormState);

  async function handleRegister() {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
          parental_involvment: form.parent_involvement,
          distance_from_home: form.distance_from_home,
          sleep_hours: form.sleep_hours.toString(),
          motivation_level: form.motivation_level,
          internet_access: form.internet_access,
          school_type: form.school_type,
          gender: form.gender,
          learning_disability: form.learning_disability,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data) {
        toast(data.message);
        if (response.ok) {
          setForm(initialFormState);
        }
      }
    } catch (error) {
      toast("An error occurred", {
        icon: "❌",
      });
    }
  }

  const { refetch, isLoading } = useQuery("register", handleRegister, {
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-white text-black hover:bg-zinc-200">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen overflow-y-scroll">
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>
          Create an account to access all the features.
        </DialogDescription>
        <form>
          <div className="flex flex-col gap-4">
            <Label htmlFor="firstname">Firstname</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, firstname: event.target.value }))
              }
              value={form.firstname}
              id="firstname"
              type="text"
              placeholder="Firstname"
            />
            <Label htmlFor="lastname">Lastname</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, lastname: event.target.value }))
              }
              value={form.lastname}
              id="lastname"
              type="text"
              placeholder="Lastname"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              value={form.email}
              id="email"
              type="email"
              placeholder="Email"
            />
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              value={form.password}
              type="password"
              placeholder="Password"
            />
            <Label htmlFor="parent_involvement">Parent Involvement</Label>

            <Input
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  parent_involvement: event.target.checked,
                }))
              }
              checked={form.parent_involvement}
              id="parent_involvement"
              type="checkbox"
            />
            <Label htmlFor="distance_from_home">Distance from Home</Label>
            <RadioGroup
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  distance_from_home: value as "0" | "1" | "2",
                }))
              }
              value={form.distance_from_home}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="distance_0" />
                <Label htmlFor="distance_0">Less than 1 km</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="distance_1" />
                <Label htmlFor="distance_1">1 to 5 km</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="distance_2" />
                <Label htmlFor="distance_2">More than 5 km</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="sleep_hours">Sleep Hours</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  sleep_hours: Number(event.target.value),
                }))
              }
              value={form.sleep_hours}
              id="sleep_hours"
              type="number"
              placeholder="Sleep Hours"
            />
            <Label htmlFor="motivation_level">Motivation Level</Label>
            <RadioGroup
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  motivation_level: value as "0" | "1" | "2",
                }))
              }
              value={form.motivation_level}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="motivation_0" />
                <Label htmlFor="motivation_0">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="motivation_1" />
                <Label htmlFor="motivation_1">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="motivation_2" />
                <Label htmlFor="motivation_2">High</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="internet_access">Internet Access</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  internet_access: event.target.checked,
                }))
              }
              checked={form.internet_access}
              id="internet_access"
              type="checkbox"
            />
            <Label htmlFor="school_type">School Type</Label>
            <RadioGroup
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  school_type: value as "0" | "1",
                }))
              }
              value={form.school_type}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="school_type_0" />
                <Label htmlFor="school_type_0">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="school_type_1" />
                <Label htmlFor="school_type_1">Private</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="gender">Gender</Label>
            <RadioGroup
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  gender: value as "0" | "1",
                }))
              }
              value={form.gender}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="gender_0" />
                <Label htmlFor="gender_0">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="gender_1" />
                <Label htmlFor="gender_1">Female</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="learning_disability">Learning Disability</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  learning_disability: event.target.checked,
                }))
              }
              checked={form.learning_disability}
              id="learning_disability"
              type="checkbox"
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                refetch();
              }}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Navbar = () => {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const loading = useAuth((state) => state.loading);
  const [toggled, setToggled] = useState(false);
  return (
    <div className="box-border fixed top-0 left-0 w-full p-6 z-10">
      <div className="flex items-center justify-between bg-slate-500  py-2 px-6 rounded-md">
        <div>
          <h1 className="text-xl flex items-center">
            <Lottie animationData={robotJson} className="w-8 h-8" /> Scory
            <span className="font-bold">AI</span>
          </h1>
        </div>
        {loading ? (
          <div>
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="flex gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setToggled((prev) => !prev);
                  }}
                  className="p-3  rounded-full bg-slate-700 text-white flex items-center justify-center"
                >
                  <User className="w-4 h-4" />
                </button>

                {toggled && (
                  <div className="absolute top-full mt-2 right-0 w-[200px] bg-white p-4 rounded-md shadow-md">
                    <p className="text-sm font-semibold"></p>
                    <Link
                      to="/account"
                      className="flex items-center gap-1 p-2 rounded hover:bg-zinc-200"
                    >
                      <User className="w-4 h-4" /> Account
                    </Link>
                    <Link
                      to="/subjects"
                      className="flex items-center gap-1 p-2 rounded hover:bg-zinc-200"
                    >
                      <LibraryBig className="w-4 h-4" /> Subjects
                    </Link>
                    <Button
                      onClick={() => {
                        logout();
                      }}
                      className="mt-2 w-full"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <LoginModal />
                <RegisterModal />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
