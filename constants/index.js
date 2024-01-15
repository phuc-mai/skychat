import { Forum, PermContactCalendar } from "@mui/icons-material";

export const links = [
  {
    label: "Chats",
    icon: <Forum sx={{ color: "#737373", fontSize: "26px" }}/>,
    url: "/chats",
  },
  {
    label: "Create Chat",
    icon: <PermContactCalendar sx={{ color: "#737373", fontSize: "26px" }}/>,
    url: "/create-chat",
  }
]
