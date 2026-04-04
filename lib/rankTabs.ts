import { RankType } from "../App";

export const RANK_TABS: { key: RankType; label: string; infoTitle: string; info: string }[] = [
  {
    key: "gesamt",
    label: "Gesamt",
    infoTitle: "Der Gesamtscore",
    info: " kombiniert alle drei Kategorien: Nährwerte zählen 50 %, Geschmack 40 % und Preis 10 %. Ein Riegel muss also sowohl nährstoffreich als auch schmackhaft sein, um ganz vorne zu landen.",
  },
  {
    key: "naehrwert",
    label: "Nährwerte",
    infoTitle: "Der Nährwerte-Score",
    info: " bewertet auf 100 Punkten: Protein/Kcal-Verhältnis (50 Pkt), Zuckergehalt (25 Pkt), Fettgehalt (10 Pkt) und Kollagenanteil (15 Pkt). Wichtig: Kollagenhydrolysat zählt auf dem Etikett als Protein, liefert aber kein vollständiges Aminosäureprofil — wir rechnen es daher nur anteilig an.",
  },
  {
    key: "geschmack",
    label: "Geschmack",
    infoTitle: "Der Geschmacks-Score",
    info: " sortiert nach unserer Bewertung auf einer Skala von 0–10. Geschmack ist immer subjektiv — wir haben jeden Riegel zu dritt blind verkostet und den Durchschnitt gebildet.",
  },
  {
    key: "preis",
    label: "Preis",
    infoTitle: "Der Preis-Score",
    info: " sortiert nach Preis pro 100g — je günstiger, desto besser. So lassen sich Riegel mit unterschiedlichem Gewicht fair vergleichen.",
  },
];

export const RANK_FIELD: Record<RankType, string> = {
  gesamt: "rank_gesamt",
  naehrwert: "rank_naehrwert",
  geschmack: "rank_geschmack",
  preis: "rank_preis",
};
