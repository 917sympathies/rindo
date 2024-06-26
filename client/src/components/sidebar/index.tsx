"use client";
import styles from "./styles.module.css";
import {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import Link from "next/link";
import { useRouter, useParams, redirect } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
// import {  Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,} from "../ui/drawer";
import { SquareActivity, ArrowDown, Plus, ClipboardList } from "lucide-react";
import AddProjectModal from "../addProjectModal";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/types";
import { ICookieInfo } from "@/types";
import { ModeToggle } from "../modeToggle";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState
} from "@microsoft/signalr";


interface ISidebarProps {
  // toFetch: boolean;
  // setFetch: Dispatch<SetStateAction<boolean>>;
  // onCreate: () => void;
}

interface IProjectInfo {
  id: string;
  name: string;
}

const Sidebar = ({}: ISidebarProps) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["test-cookies"]);
  const { id } = useParams();
  const [user, setUser] = useState<IUser>();
  const [projects, setProjects] = useState<IProjectInfo[] | []>( [] as IProjectInfo[]);
  const [conn, setConnection] = useState<HubConnection | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [toFetch, setFetch] = useState(false);

  useEffect(() => {
    const temp = localStorage.getItem("user");
    if (!temp) return;
    const u = JSON.parse(temp);
    setUser(u);
    async function start() {
      let connection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5000/chat`)
        .build();
      setConnection(connection);
      if (connection.state === HubConnectionState.Disconnected) {
        await connection.start();
      } else {
        console.log("Already connected");
      }
    }
    start();
  }, []);

  try {
    if(conn){
    conn.on(`ReceiveDeleteProject`, (projectId) => {
      setProjects(projects?.filter(p => p.id !== projectId))
    });
    conn.on(`ReceiveAcceptInvite${user?.id}`, (projectId, name) => {
      const project = {id: projectId, name: name} as IProjectInfo;
      setProjects([...projects, project])
    });
    conn.on(`ReceiveChangeProjectName`, (projectId, name) => {
      setProjects(projects?.map(project => {
        if(project.id !== projectId) return project;
        else{
          return {
            ...project,
            name: name
          }
        }
      }))
    })
    }
  } catch (exception) {
    console.log(exception);
  }

  try {
    if(conn){
    conn.on(`HelloMsg`, (message) => {
      console.log(message);
    });
  }
  } catch (exception) {
    console.log(exception);
  }

  useEffect(() => {
    const fetchProjectsInfo = async () => {
      const token = cookies["test-cookies"];
      if (token === undefined) {
        // return;
        router.push("/login");
        redirect("/login");
      }
      const decoded = jwtDecode(token) as ICookieInfo;
      const response = await fetch(
        `http://localhost:5000/api/project?userId=${decoded.userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.status === 401 || response.status === 404) {
        removeCookie("test-cookies", { path: "/" });
        router.push("/login");
      }
      const data = await response.json();
      //setUser(data);
      setProjects(data);
    };

    if (!user || toFetch) {
      fetchProjectsInfo();
      setFetch(false);
    }
  }, [toFetch]);

  const signOut = () => {
    removeCookie("test-cookies", { path: "/" });
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="pt-[10px] pb-[10px] flex flex-col items-center justify-between border-r border-[rgba(1,1,1,0.1)] w-full dark:border-gray-400">
      <ul style={{ width: "90%", maxHeight: "80vh" }} className="list-none">
        {/* <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 100 100"
            fill="none"
          >
            <rect width="36" height="36" fill="white" />
            <path
              d="M42.5 16H59L30 75H12L42.5 16Z"
              fill="#88FFD4"
              fill-opacity="0.7"
            />
            <path
              d="M54.6383 46.514C44.2979 45.3575 42 46.514 42 46.514L64.2128 92H78C78 92 64.9787 47.6704 54.6383 46.514Z"
              fill="#88FFD4"
              fill-opacity="0.5"
            />
            <path
              d="M56.5 16H93.5C93.5 16 101 18 93.5 27C86 36 51 27 51 27L56.5 16Z"
              fill="#88FFD4"
              fill-opacity="0.3"
            />
            <path
              d="M70 24C68 17 60 24 86 24C112 24 57.5 48 57.5 48C57.5 48 38 46 42.5 46.5C47 47 72 31 70 24Z"
              fill="#88FFD4"
              fill-opacity="0.4"
            />
          </svg>
          <Typography
            style={{
              textTransform: "uppercase",
              fontFamily: "inherit",
              fontSize: "1.1rem",
              color: "rgba(136, 255, 212, 0.4)",
            }}
          >
            indo
          </Typography>
        </div> */}
        <li
          className="items-center justify-between"
          style={{ display: "grid", gridTemplateColumns: "9fr 1fr" }}
        >
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="m-0 p-0 text-[#727376] font-inherit ml-2 flex flex-row items-center gap-2 p-1 rounded-lg hover:bg-gray-50 ease-in-out duration-300 dark:hover:bg-black/20">
            <Avatar
              className="rounded-lg bg-blue-400"
              style={{
                backgroundColor: "#4198FF",
                color: "white",
                width: "2.5vh",
                height: "2.5vh",
                fontSize: "0.6rem",
                margin: "0.1rem",
                marginLeft: "0.4rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {user?.username?.slice(0,1)}
            </Avatar>
            <h1 className="m-0 p-0 text-[1.1rem]">{user?.username}</h1>
          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-[#111] dark:border-black/20">
        <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-black/20"/>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile" className="w-full" passHref={true}>
              Профиль
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="dark:bg-black/20"/>
        <DropdownMenuItem>
          <Link href="https://github.com/917sympathies" className="w-full" passHref={true} target="_blank">
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Поддержка</DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-black/20"/>
        <DropdownMenuItem onClick={() => signOut()}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
          <ModeToggle />
        </li>
        <li>
          <div className="flex items-center justify-between">
            <div className="text-[#727376] font-medium uppercase text-[1rem]">
              проекты
            </div>
          </div>
        </li>
        {projects &&
          projects.map((project) => (
            <div
              className={styles.sidebarproject}
              style={
                project.id == id
                  ? { backgroundColor: "rgba(1, 1, 1, 0.1)", color: "black" }
                  : {}
              }
              key={project.id}
            >
              <Link
                href={`/project/${project.id}/board`}
                className="no-underline w-full flex items-center dark:text-white"
              >
                <SquareActivity
                  className="mr-3"
                  size={20}
                />
                <div className="text-[1rem]">{project.name}</div>
              </Link>
            </div>
          ))}
        <Button className="w-full rounded-md text-white bg-[#3A86FF] hover:bg-blue-800 ease-in-out duration-300" onClick={() => setIsOpen(true)}>
          <div className="flex flex-row items-center">
            <Plus className="mr-[6px]" size={18} />
            <span className="font-normal text-[1rem]">
              Новый проект
            </span>
          </div>
        </Button>
        <div 
        className="flex flex-row items-center 
        p-4 
        text-[1rem] text-[#727376] justify-center w-full dark:text-white">
            <Link href="/tasks" className="flex flex-row items-center gap-2">
              <ClipboardList size={18}></ClipboardList>
              Мои задачи
            </Link>
        </div>
      </ul>
      <Sheet key="right" open={isOpen}>
        <SheetContent
          className="h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none"
          side={"right"}
        >
          <AddProjectModal
            onClose={() => setIsOpen(false)}
            setFetch={setFetch}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
