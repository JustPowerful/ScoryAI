import { useAuth } from "@/stores/authStore";
import Container from "../global/Container";
import { Button } from "../ui/button";
import { Bot, Loader2, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import robotAnimation from "@/assets/lottie/robot.json";

const Subject = ({
  subject,
  reload,
}: {
  subject: {
    id: string;
    title: string;
  };
  reload: () => Promise<void>;
}) => {
  async function deleteSubject() {
    const response = await fetch(`/api/subject/delete/${subject.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }

  const { isFetching: isDeleting, refetch: deleteSub } = useQuery(
    "deleteSubject",
    deleteSubject,
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{subject.title}</h1>
      <div className="flex items-center gap-2">
        <Link
          to={`/subject/${subject.id}`}
          className="bg-blue-600 text-white p-1.5 rounded-md flex  items-center gap-1"
        >
          <Bot className="w-6 h-6" />
          Go to predictions
        </Link>
        <Button
          onClick={() => {
            deleteSub().then(() => {
              reload();
            });
          }}
          className="bg-red-500 hover:bg-red-600 text-wrap"
        >
          {isDeleting ? (
            <span>
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          ) : (
            <span>
              <Trash className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

const Subjects = () => {
  const user = useAuth((state) => state.user);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toggleCreate, setToggleCreate] = useState(false);

  const [title, setTitle] = useState("");

  async function fetchSubjects() {
    const response = await fetch(
      `/api/subject/paginate?page=${page}&search=${search}&limit=5`
    );
    const data = await response.json();
    if (response.ok) {
      return data as {
        subjects: {
          id: string;
          title: string;
        }[];
        totalPages: number;
      };
    } else {
      throw new Error(data.message);
    }
  }

  const { refetch, data, isFetching } = useQuery("subjects", fetchSubjects);

  async function createSubject() {
    const response = await fetch("/api/subject/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      refetch();
      setTitle("");
      setToggleCreate(false);
      return data.subject;
    } else {
      throw new Error(data.message);
    }
  }

  const { refetch: create, isFetching: isCreating } = useQuery(
    "createSubject",
    createSubject,
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [page]);
  return (
    <div>
      <Dialog open={toggleCreate} onOpenChange={setToggleCreate}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a subject</DialogTitle>
            <DialogDescription>
              Create a subject to start tracking your progress.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Subject title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button
            onClick={() => {
              create();
            }}
          >
            {isCreating ? (
              <span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              <span>Create</span>
            )}
          </Button>
        </DialogContent>
      </Dialog>

      <Container className="px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lottie animationData={robotAnimation} className="w-20 h-20" />
            <div>
              <h1 className="text-2xl font-semibold">
                Hello, {user?.firstname}.
              </h1>
              <p className="text-gray-500">
                Here are the subjects you are currently studying.
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                setToggleCreate((prev) => !prev);
              }}
              className="flex items-center gap-1 "
            >
              <Plus className="w-4 h-4" /> Create Subject
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-[20fr_1fr] gap-2 mt-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search subjects..."
          />

          <Button
            onClick={() => {
              refetch();
            }}
          >
            <Search className="w-6 h-6" />{" "}
          </Button>
        </div>
        {isFetching ? (
          <div className="flex items-center justify-center mt-5">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div>
            {data?.subjects.map((subject) => (
              <Subject
                reload={async () => {
                  await refetch();
                }}
                subject={subject}
                key={subject.id}
              />
            ))}
          </div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            />
            {Array.from({ length: data?.totalPages || 1 }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setPage(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, data?.totalPages || 1))
              }
            />
          </PaginationContent>
        </Pagination>
      </Container>
    </div>
  );
};

export default Subjects;
