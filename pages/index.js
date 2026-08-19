import dynamic from "next/dynamic";

const AriaVoiceHud = dynamic(() => import("../components/AriaVoiceHud"), {
  ssr: false,
});

export default function Home() {
  return <AriaVoiceHud />;
}
