import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect("/student/login?service=study-room");
}
