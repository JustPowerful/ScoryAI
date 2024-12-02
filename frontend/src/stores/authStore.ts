import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAuth = create<{
  loading: boolean;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    parental_involvment: boolean;
    distance_from_home: string;
    sleep_hours: number;
    motivation_level: string;
    internet_access: boolean;
    school_type: string;
    gender: string;
    learning_disability: boolean;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>()(
  devtools((set) => {
    const validateUser = async () => {
      set({ loading: true });
      try {
        const response = await fetch(`/api/auth/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data) {
          if (response.ok) {
            set({
              user: {
                id: data.user.id,
                firstname: data.user.firstname,
                lastname: data.user.lastname,
                email: data.user.email,
                parental_involvment: data.user.parental_involvment,
                distance_from_home: data.user.distance_from_home,
                sleep_hours: data.user.sleep_hours,
                motivation_level: data.user.motivation_level,
                internet_access: data.user.internet_access,
                school_type: data.user.school_type,
                gender: data.user.gender,
                learning_disability: data.user.learning_disability,
              },
            });
          }
        }
      } catch (error) {
        // if an error occurs or user is not logged in, set user to null
        return null;
      } finally {
        set({ loading: false });
      }
    };

    validateUser(); // validate user on hook load to check if user is logged in and to get the newest user data

    return {
      loading: false,
      user: null,
      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data) {
            console.log(data);
            if (response.ok) {
              set({
                user: {
                  id: data.user.id,
                  firstname: data.user.firstname,
                  lastname: data.user.lastname,
                  email: data.user.email,
                  parental_involvment: data.user.parental_involvment,
                  distance_from_home: data.user.distance_from_home,
                  sleep_hours: data.user.sleep_hours,
                  motivation_level: data.user.motivation_level,
                  internet_access: data.user.internet_access,
                  school_type: data.user.school_type,
                  gender: data.user.gender,
                  learning_disability: data.user.learning_disability,
                },
              });
            }
          }
        } catch (error) {
          console.error(error);
          throw new Error("An error occurred");
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ loading: true });
        try {
          const response = await fetch(`/api/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            set({ user: null });
          }
        } catch (error) {
          throw new Error("An error occurred");
        } finally {
          set({ loading: false });
        }
      },
      validate: validateUser,
    };
  })
);
