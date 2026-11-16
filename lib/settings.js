// The colour schemes and holiday themes you can pick under /indstillinger.
// The choice is saved in cookies, so app/layout.js can use it on every page.

export const COLOR_COOKIE = "farve";
export const BACKGROUND_COOKIE = "baggrund";

// The colours themselves are in app/globals.css under [data-farve="…"]
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

// Each background is the image /temaer/<id>.png
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

export function getColorScheme(id) {
  return COLOR_SCHEMES.find((scheme) => scheme.id === id) ?? COLOR_SCHEMES[0];
}

// { id, name, image, theme } or null when no background is chosen
export function getBackground(id) {
  for (const theme of THEMES) {
    const background = theme.backgrounds.find((item) => item.id === id);
    if (background) return { ...background, image: `/temaer/${background.id}.png`, theme: theme.id };
  }
  return null;
}
