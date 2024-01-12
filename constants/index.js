import { Forum, PermContactCalendar } from "@mui/icons-material";

export const links = [
  {
    label: "Chats",
    icon: <Forum sx={{ color: "#737373", fontSize: "26px" }}/>,
    url: "/chats",
  },
  {
    label: "Contacts",
    icon: <PermContactCalendar sx={{ color: "#737373", fontSize: "26px" }}/>,
    url: "/contacts",
  }
]

export const chats = [
  {
    profileImage: "/assets/phucmai.png",
    username: "Phuc Mai",
    text: "Hi there, how are you?",
  },
  {
    profileImage: "/assets/sunehildeep.png",
    username: "Sunehildeep Singh",
    text: "I'm still waiting",
  },
  {
    profileImage: "/assets/ngocmai.jpg",
    username: "Ngoc Mai",
    text: "Do you have the note?",
  },
  {
    profileImage: "/assets/andrew.jpg",
    username: "Andrew Jones",
    text: "Let's go for a coffee!",
  },
]