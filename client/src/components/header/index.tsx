"use client";
import styles from "./styles.module.css";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Chat from "../chat";
import { Sheet, SheetContent } from "../ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ICookieInfo } from "@/types";
import { useCookies } from "react-cookie";

interface HeaderProps {
  setIsSelectorVisible: Dispatch<SetStateAction<boolean>>;
  isChatActive: boolean;
  setIsChatActive: Dispatch<SetStateAction<boolean>>;
}

interface IProject {
  name: string;
  chatId: string;
  ownerId: string;
}

export default function Header({
  setIsSelectorVisible,
  isChatActive,
  setIsChatActive,
}: HeaderProps) {
  const { id } = useParams<{ id: string }>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["test-cookies"]);
  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId == project?.ownerId) setIsOwner(true);
    else setIsOwner(false);
  }, [project]);

  useEffect(() => {
    const getProjectInfo = async (id: string) => {
      const response = await fetch(
        `http://localhost:5000/api/project/${id}/header`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setProject(data);
    };
    getProjectInfo(id);
  }, [id]);

  return (
    <div
      style={{
        margin: 0,
        padding: "20px 10px",
        borderBottom: "1px solid rgba(1, 1, 1, 0.1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: `${isChatActive ? "calc(100% - 18vw)" : "100%"}`,
        transition: "all .3s ease-out",
        fontWeight: "500",
      }}
    >
      <Link
        className="m-[10px] text-[1.4rem]"
        href={`/project/${id}/board`}
        onClick={() => setIsSelectorVisible(true)}
      >
        {project && project.name}
      </Link>
      <div
        className={styles.chatButton}
        onClick={() => setIsChatActive(!isChatActive)}
      >
        <h3 className="text-[1.2rem]">Чат проекта</h3>
      </div>
      <Link
        className="text-[1.2rem]"
        href={`/project/${id}/board`}
        onClick={() => setIsSelectorVisible(true)}
      >
        <h3>Задачи</h3>
      </Link>
      {isOwner ? (
        <Link
          className="text-[1.2rem]"
          href={`/project/${id}/settings/general`}
          onClick={() => setIsSelectorVisible(false)}
        >
          <h3>Настройки</h3>
        </Link>
      ) : (
        <div></div>
      )}
      <Sheet key={"right"} open={isChatActive} modal={false}>
        <SheetContent
          className="h-screen top-0 right-0 left-auto mt-0 w-[400px] rounded-none"
          side={"right"}
        >
          <Chat
            isActive={isChatActive}
            setIsChatActive={setIsChatActive}
            chatId={project?.chatId}
            projectName={project?.name}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
