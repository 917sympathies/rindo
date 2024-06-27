import styles from "./styles.module.css";
import {useState, useEffect, Dispatch, SetStateAction} from 'react'
import { IStage, IUserRights } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../task";
import { TurnOffDefaultPropsWarning } from "@/components/turnOffDefaultPropsWarning";
import {X, Plus} from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState
} from "@microsoft/signalr";

interface IStageProps {
  stage: IStage;
  handleDeleteStage: (id: string) => void;
  onClick: () => void;
  setFetch: Dispatch<SetStateAction<boolean>>;
  rights: IUserRights
}

export default function Stage({ stage, onClick, handleDeleteStage, setFetch, rights }: IStageProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [conn, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
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
    conn.on(`ReceiveTaskAdd${stage.projectId}`, (needToFetch) => {
      console.log("JDOSAKJDASLDJA")
      setFetch(needToFetch);
    });
    }
  } catch (exception) {
    console.log(exception);
  }


  return (
    <div className="bg-[rgba(1,1,1,0.03)] min-w-[300px] max-w-[300px] flex flex-col justify-center items-center h-[80vh] text-[rgb(102,102,102)] mt-5 rounded-lg dark:bg-black/50">
      <div className={styles.header}>
        <TurnOffDefaultPropsWarning/>
        <p style={{ margin: "0", display: "flex", justifyContent: "center", flexGrow: "1" }}>
          {stage.name}
        </p>
        {rights.canDeleteStage ? 
        <X className={styles.closeBtn} size={24} onClick={() => setIsModalOpen(true)}/> : <></> }
      </div>
      <div style={{ flexGrow: "20", maxHeight: "80vh", width: "90%", margin: "8px 0px" }}>
        {rights.canAddTask ? 
        <Button className={styles.addbutton} onClick={onClick}>
          <Plus style={{ color: "inherit" }} size={16}/>
        </Button>
        : <div></div> }
        <Droppable key={stage.name} droppableId={stage.id}>
          {(provided) => (
            <ScrollArea className="h-[70vh]">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[2rem] mr-[0.8rem] w-full"
            >
              {stage &&
                stage.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <Task key={task.id} task={task} setFetch={setFetch} rights={rights}/>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
            </ScrollArea>
          )}
        </Droppable>
      </div>
      <Dialog
        open={isModalOpen}
      >
        <DialogContent>
        <div
          className="gap-4"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            width: "100%",
            minHeight: "6rem",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <Label style={{ color: "black", alignSelf: "center" }}>
            Вы действительно хотите удалить стадию?
          </Label>
          <div style={{ display: "flex", alignSelf: "center" }}>
            <Button
              onClick={() => handleDeleteStage(stage.id)}
              style={{
                color: "white",
                backgroundColor: "green",
                marginRight: "0.4rem",
              }}
            >
              Да
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ color: "white", backgroundColor: "red" }}
            >
              Нет
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
