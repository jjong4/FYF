import { Metadata } from "next";
import EmotionReviewBoard from "./components/EmotionReviewBoard";

export const metadata: Metadata = {
  title: "FYF",
  description: "Feel your feelings",
};

export default function Home() {
  return (
    <main className="bg-white">
      <title>FYF</title>
      <EmotionReviewBoard />
    </main>
  );
}