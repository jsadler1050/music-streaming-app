"use client"
import Allsongs from "./components/Allsongs";
import FrontendLayout from "@/layouts/FrontendLayout";

export default function Home() {
  return (
    <FrontendLayout>
      <div>
        <Allsongs />
      </div>
    </FrontendLayout>
  );
}
