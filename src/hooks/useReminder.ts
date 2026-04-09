import { useEffect } from "react";
import { socket } from "../socket";
import { notification } from "antd";

export const useReminder = (userId: number | null) => {
  useEffect(() => {
    if (!userId) {
      console.error("❌ [useReminder] Không có userId, Socket không thể kết nối!");
      return;
    }

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join_room", userId); 
    });

    socket.on("connect_error", (err) => {
      console.error("❌ [Socket] Lỗi kết nối:", err.message);
    });

    socket.on("REMINDER_TOAST", (data: { title: string; message: string; taskId: number }) => {
      
      notification.warning({
        message: data.title,
        description: data.message,
        placement: "topRight",
        duration: 10,
      });
    });

    return () => {
      socket.off("REMINDER_TOAST");
      socket.disconnect();
    };
  }, [userId]);
};