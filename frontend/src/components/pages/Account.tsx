import { useAuth } from "@/stores/authStore";
import Container from "../global/Container";
import { User } from "lucide-react";

const Account = () => {
  const user = useAuth((state) => state.user);
  return (
    <div>
      <Container className="px-10">
        <div className="flex items-start gap-2">
          <div className="w-20 h-20 rounded-full bg-slate-500 text-white flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Account Information</h1>
            <p>
              <strong>Name:</strong> {user?.firstname} {user?.lastname}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Parental Involvement:</strong>{" "}
              {user?.parental_involvment ? "Yes" : "No"}
            </p>
            <p>
              <strong>Distance from Home:</strong>{" "}
              {user?.distance_from_home === "0"
                ? "Near"
                : user?.distance_from_home === "1"
                ? "Not Very Near"
                : "Far"}
            </p>
            <p>
              <strong>Sleep Hours:</strong> {user?.sleep_hours} hours
            </p>
            <p>
              <strong>Motivation Level:</strong> {user?.motivation_level}
            </p>
            <p>
              <strong>Internet Access:</strong>{" "}
              {user?.internet_access ? "Yes" : "No"}
            </p>
            <p>
              <strong>School Type:</strong>{" "}
              {user?.school_type === "0" ? "Public" : "Private"}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {user?.gender === "0" ? "Male" : "Female"}
            </p>
            <p>
              <strong>Learning Disability:</strong>{" "}
              {user?.learning_disability ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Account;
