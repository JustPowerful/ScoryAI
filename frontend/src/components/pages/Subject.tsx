import { useParams } from "react-router-dom";
import Container from "../global/Container";
import { useQuery } from "react-query";
import { Button } from "../ui/button";
import { Check, Loader2, Plus, XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Slider } from "@/components/ui/slider";

import { useState } from "react";
import { Input } from "../ui/input";

const Subject = () => {
  const { id } = useParams();
  const getSubject = async () => {
    const response = await fetch(`/api/subject/${id}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  };
  const {
    refetch,
    data: subjectData,
    isLoading: isSubjectLoading,
  } = useQuery("getSubject", getSubject, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const getPredictions = async () => {
    const response = await fetch(`/api/prediction/getall/${id}`);
    const data = await response.json();
    if (response.ok) {
      return data.predictions;
    } else {
      throw new Error(data.message);
    }
  };

  const {
    refetch: refetchPred,
    data: predictionsData,
    isLoading: isPredictionsLoading,
  } = useQuery("getPredictions", getPredictions, {
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const [form, setForm] = useState({
    hoursStudied: 0,
    attendance: 0,
    tutoringSessions: 0,
    accessToRessource: 0,
  });

  async function createPrediction() {
    const response = await fetch(`/api/prediction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectId: id,
        hoursStudied: form.hoursStudied,
        attendance: form.attendance,
        tutoringSessions: form.tutoringSessions,
        accessToRessource: form.accessToRessource,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }

  const { refetch: createPred, isLoading: isCreating } = useQuery(
    "createPrediction",
    createPrediction,
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <Container>
        <div className="px-4">
          {isSubjectLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="mb-10">
              Subject:
              <h1 className="text-2xl font-bold">
                {subjectData.subject.title}
              </h1>
            </div>
          )}

          <div className="flex justify-between items-center p-4">
            Predictions:{" "}
            <Dialog open={toggle} onOpenChange={setToggle}>
              <DialogTrigger>
                <Button>
                  <Plus className="w-4 h-4" /> New Prediction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {subjectData && (
                    <DialogTitle>
                      Predictions for {subjectData.subject.title}
                    </DialogTitle>
                  )}
                  <DialogDescription>
                    Fill in the form below to make a new prediction. please note
                    that this model will access your account data to make the
                    prediction based on your given informations.
                  </DialogDescription>
                </DialogHeader>
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="hoursStudied"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hours Studied Per Week
                    </label>
                    <Input
                      type="number"
                      name="hoursStudied"
                      value={form.hoursStudied}
                      onChange={(event) => {
                        setForm({
                          ...form,
                          hoursStudied: Number(event.target.value),
                        });
                      }}
                      placeholder="Hours studied per week"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="attendance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Attendance % (Approximation)
                    </label>
                    <div className="grid grid-cols-[10fr_1fr] gap-2">
                      <Slider
                        name="attendance"
                        value={[form.attendance]}
                        max={100}
                        onValueChange={(value) =>
                          setForm({ ...form, attendance: Number(value) })
                        }
                      />
                      <div>{form.attendance}%</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="tutoringSessions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tutoring Sessions per Month
                    </label>

                    <Input
                      type="number"
                      name="tutoringSessions"
                      placeholder="Tutoring sessions per month"
                      value={form.tutoringSessions}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          tutoringSessions: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="accessToRessource"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Access to Ressource
                    </label>

                    <select
                      id="accessToRessource"
                      name="accessToRessource"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={form.accessToRessource}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accessToRessource: Number(e.target.value),
                        })
                      }
                    >
                      <option value="2">Low</option>
                      <option value="1">Medium</option>
                      <option value="0">High</option>
                    </select>
                  </div>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      createPred().then(() => {
                        refetchPred().then(() => {
                          setToggle(false);
                        });
                      });
                    }}
                    type="submit"
                  >
                    {isCreating ? (
                      <span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </span>
                    ) : (
                      "Predict"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isPredictionsLoading ? (
            <div>Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Studied
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutoring Sessions
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access to Resource
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted Score
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {predictionsData &&
                  predictionsData.map((prediction: any) => (
                    <tr key={prediction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prediction.hours_studied} hrs/week
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prediction.attendance}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prediction.tutoring_sessions} sessions/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prediction.access_to_ressource === "2" && "LOW"}
                        {prediction.access_to_ressource === "1" && "MEDIUM"}
                        {prediction.access_to_ressource === "0" && "HIGH"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Number(prediction.predicted_score).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Number(prediction.predicted_score) >= 50 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            {" "}
                            <Check className="w-4 h-4" /> Pass
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <XIcon className="w-4 h-4" />
                            Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Subject;
