import { Details } from "@/components/public/Details";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { Menu } from "@/components/public/Menu";
import { Rsvp } from "@/components/public/Rsvp";
import { StickyRsvp } from "@/components/public/StickyRsvp";
import { getEvent, getMenu } from "@/lib/content";

export default function Home() {
  const event = getEvent();
  const menu = getMenu();

  return (
    <>
      <Hero event={event} />
      <main>
        <Menu menu={menu} />
        <Rsvp event={event} />
        <Details event={event} />
      </main>
      <Footer />
      <StickyRsvp />
    </>
  );
}
