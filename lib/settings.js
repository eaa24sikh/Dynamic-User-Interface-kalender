// Farvetemaer og højtids-baggrunde, som man kan vælge under /indstillinger.
// Valget gemmes i cookies, så app/layout.js kan bruge det på alle sider.

export const COLOR_COOKIE = "farve";
export const BACKGROUND_COOKIE = "baggrund";

// Giver værdien af en cookie, eller null hvis den ikke findes
export function readCookie(cookieStore, name) {
  const cookie = cookieStore.get(name);
  if (!cookie) {
    return null;
  }
  return cookie.value;
}

// Selve farverne står i app/globals.css under [data-farve="…"]
export const COLOR_SCHEMES = [
  {
    id: "scrapbog",
    name: "Scrapbog",
    description: "lyderød, hvid og lilla",
    preview: "/icons/indstillinger/farve-scrapbog.svg",
  },
  {
    id: "natur",
    name: "Natur",
    description: "grøn, creme og sage",
    preview: "/icons/indstillinger/farve-natur.svg",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "blå, creme og bordeauxrød",
    preview: "/icons/indstillinger/farve-elegant.svg",
  },
];

// Hver baggrund er billedet /temaer/<id>.png
export const THEMES = [
  {
    id: "jul",
    name: "Jul",
    tile: "/temaer/knap-jul.png",
    backgrounds: [
      { id: "jul-blaa", name: "Blå med sukkerstokke" },
      { id: "jul-roed", name: "Rød med sløjfer" },
      { id: "jul-brun", name: "Beige med sukkerstokke" },
    ],
  },
  {
    id: "valentin",
    name: "Valentine",
    tile: "/temaer/knap-valentin.png",
    backgrounds: [
      { id: "valentin-amors-pil", name: "Amors pil" },
      { id: "valentin-hjerter-beige", name: "Røde hjerter på creme" },
      { id: "valentin-hjerter-lyseroed", name: "Røde hjerter på lyserød" },
      { id: "valentin-hjerter-brun", name: "Lyserøde hjerter på brun" },
    ],
  },
  {
    id: "paaske",
    name: "Påske",
    tile: "/temaer/knap-paaske.png",
    backgrounds: [
      { id: "paaske-2", name: "Lyserød med påskeæg" },
      { id: "paaske-1", name: "Creme med blåt mønster" },
    ],
  },
  {
    id: "halloween",
    name: "Halloween",
    tile: "/temaer/knap-halloween.png",
    backgrounds: [
      { id: "halloween-flagermus", name: "Flagermus" },
      { id: "halloween-spoegelser", name: "Spøgelser" },
      { id: "halloween-katte", name: "Katte" },
      { id: "halloween-graeskar", name: "Græskar" },
    ],
  },
];

// Finder farvetemaet med det id. Findes det ikke, bruges det første (Scrapbog).
export function getColorScheme(id) {
  for (const scheme of COLOR_SCHEMES) {
    if (scheme.id === id) {
      return scheme;
    }
  }
  return COLOR_SCHEMES[0];
}

// Finder baggrunden med det id.
// Giver { id, name, image, theme } – eller null, hvis der ikke er valgt nogen baggrund.
export function getBackground(id) {
  for (const theme of THEMES) {
    for (const background of theme.backgrounds) {
      if (background.id === id) {
        return {
          id: background.id,
          name: background.name,
          image: `/temaer/${background.id}.png`,
          theme: theme.id,
        };
      }
    }
  }
  return null;
}
