import { useEffect, useState } from "react";
import { getTimeGreeting } from "../../utils/helpers";
import { USER } from "../../data/mockData";

export default function Greeting() {
  const [greeting, setGreeting] = useState(() => getTimeGreeting());
  const [hasWaved, setHasWaved] = useState(false);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    setHasWaved(true);
  }, []);

  return (
    <h1 className="font-serif text-[28px] leading-tight tracking-tight text-vault-text sm:text-[32px]">
      {greeting}, {USER.name}{" "}
      <span
        className={hasWaved ? "inline-block origin-[70%_70%] animate-wave" : "inline-block"}
        role="img"
        aria-label="waving hand"
      >
        👋
      </span>
    </h1>
  );
}
