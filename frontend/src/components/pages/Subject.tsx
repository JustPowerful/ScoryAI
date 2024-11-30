import { useParams } from "react-router-dom";
import Container from "../global/Container";
import { useQuery } from "react-query";

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
  const { data: subjectData, isLoading: isSubjectLoading } = useQuery(
    "getSubject",
    getSubject,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
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
          <div>Predictions:</div>
        </div>
      </Container>
    </div>
  );
};

export default Subject;
