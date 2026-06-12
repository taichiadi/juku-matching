import { redirect } from "next/navigation";

// 質問サービスはGOUKAKU LINKのサービスのため転送
export default function StudyRoomPage() {
  redirect("/api/sso/goukakulink");
}
