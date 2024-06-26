"use client";
import styles from "./styles.module.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { User2, X, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

interface ModalProps {
  onClose: () => void;
}

export default function AddUserModal({ onClose }: ModalProps) {
  const [username, setUsername] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const handleInviteUser = async () => {
    await fetch(
      `http://localhost:5000/api/project/${id}/invite?username=${username}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    setUsername("");
    onClose();
  };

  return (
    <div
      className="bg-white dark:bg-[#111] dark:border-black/20 text-black dark:text-white"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0.2rem 0.2rem 1rem 0.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <User2 size={24} />
          <div style={{ marginLeft: "0.2rem" }}>Добавить пользователя</div>
        </div>
        <X
          size={24}
          onClick={onClose}
          className="p-1 rounded-full hover:bg-black/10 ease-in-out duration-300"
        ></X>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Input
          className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-slate-950 focus-visible:ring-offset-0 dark:border-black/40"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          className="text-white bg-blue-500 hover:bg-blue-800"
          style={{ marginRight: "0.4rem" }}
          onClick={() => handleInviteUser()}
        >
          Отправить
        </Button>
        {/* <UserRoundPlus size={36}/> */}
      </div>
    </div>
  );
}
