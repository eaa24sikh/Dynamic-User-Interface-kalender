"use client";

// "use client" betyder, at bjælken kører i browseren.
// Det skal den, fordi den skal følge fingeren (eller musen), mens man trækker en sticker.

import { useState } from "react";
import Image from "next/image";
import { placeSticker } from "@/app/actions";
import styles from "./StickerTray.module.css";

// Stickerne i bjælken. left og top placerer ikonet i sin kasse, præcis som i Figma.
const STICKERS = [
  { name: "stjerne", width: 31.1111, height: 31.1111, left: 9.78, top: 9.78 },
  { name: "blomst", width: 32.0001, height: 31.9998, left: 12, top: 9.33 },
  { name: "sol", width: 31.1111, height: 31.1111, left: 9.78, top: 9.78 },
  { name: "hjerte", width: 32, height: 32.058, left: 9.33, top: 9.33 },
  { name: "flag", width: 31.1111, height: 31.1111, left: 10.67, top: 9.78 },
  { name: "taco", width: 32, height: 32, left: 9.33, top: 9.33 },
];

// Bjælken nederst på månedssiden. Man kan trække en sticker op og slippe den på en dag.
//
// Sådan virker det:
// 1. Man trykker på en sticker (onPointerDown) – vi husker hvilken.
// 2. Man flytter fingeren (onPointerMove) – en kopi af stickeren følger med.
// 3. Man slipper (onPointerUp) – vi finder dagen under fingeren og gemmer stickeren på den.
// "Pointer" virker både med mus og finger.
export default function StickerTray() {
  // Den sticker man trækker i lige nu, og hvor fingeren er: { name, x, y }.
  // null når man ikke trækker i noget.
  const [dragging, setDragging] = useState(null);

  function startDrag(event, name) {
    // Sørg for at vi også får besked, når fingeren er flyttet væk fra stickeren
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging({ name: name, x: event.clientX, y: event.clientY });
  }

  function moveDrag(event) {
    if (!dragging) {
      return;
    }
    setDragging({ name: dragging.name, x: event.clientX, y: event.clientY });
  }

  function endDrag(event) {
    if (!dragging) {
      return;
    }
    const name = dragging.name;
    setDragging(null);

    // Find den dag, der er under fingeren. Dagene i kalenderen har data-dato="2026-11-10".
    const element = document.elementFromPoint(event.clientX, event.clientY);
    if (!element) {
      return;
    }
    const day = element.closest("[data-dato]");
    if (!day) {
      return;
    }

    placeSticker(day.dataset.dato, name);
  }

  // Hvis telefonen afbryder trækket (fx et opkald), slipper vi bare stickeren
  function cancelDrag() {
    setDragging(null);
  }

  return (
    <>
      <aside className={styles.tray}>
        <div className={styles.handle} aria-hidden="true" />
        <p className={styles.hint}>Træk en sticker ind på dag</p>
        <ul className={styles.stickers}>
          {STICKERS.map((sticker) => (
            <li
              key={sticker.name}
              className={styles.tile}
              onPointerDown={(event) => startDrag(event, sticker.name)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={cancelDrag}
            >
              <Image
                src={`/icons/sticker-${sticker.name}.svg`}
                alt={sticker.name}
                width={sticker.width}
                height={sticker.height}
                style={{ left: sticker.left, top: sticker.top }}
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </aside>

      {/* Kopien af stickeren, der følger fingeren, mens man trækker.
          Den ligger uden for bjælken, ellers ville den blive flyttet sammen med bjælken. */}
      {dragging && (
        <Image
          src={`/icons/sticker-${dragging.name}.svg`}
          alt=""
          width={32}
          height={32}
          className={styles.dragged}
          style={{ left: dragging.x, top: dragging.y }}
        />
      )}
    </>
  );
}
