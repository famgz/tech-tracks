import { Checkbox } from "@/components/ui/checkbox";

const filters = {
  Technology: [
    "AWS",
    "Angular",
    "C#",
    "CSS",
    "Flutter",
    "GCP",
    "GoLang",
    "HTML",
    "Java",
    "JavaScript",
    "Kotlin",
    "Linux",
    "MongoDB",
    "MySQL",
    "NoSQL",
    "Node.js",
    "PHP",
    "Python",
    "React",
    "Ruby",
    "SQL",
    "Spring",
    "Swift",
    "TypeScript",
  ],
  Area: [
    "Back-end Developer",
    "Front-end Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Engineer",
    "Game Developer",
    "Blockchain Developer",
    "Quality Assurance Analyst",
    "Low-code Developer",
  ],
  Company: [
    "Amdocs",
    "Avanade",
    "Banco Carrefour",
    "Banco PAN",
    "Binance",
    "Carrefour",
    "Claro",
    "Cognizant",
    "Deal Technologies",
    "Eduzz",
    "GFT Brasil",
    "iFood",
    "Impulso",
    "Inter",
    "Localiza",
    "Microsoft",
    "MRV",
    "Nexa Resources",
    "NTT DATA",
    "Philips",
    "Pottencial Seguradora",
    "Santander",
    "Sportheca",
    "Spread",
    "Squadio",
    "Sysvision",
    "Take Blip",
    "TONNIE Talent",
    "TQI",
    "Unimed-BH",
    "Vivo",
    "Warburg Pincus",
    "XP Inc.",
  ],
  Level: ["Iniciante", "Intermediário", "Avançado"],
};

export default function Filters() {
  return (
    <div className="space-y-3">
      {Object.entries(filters).map(([k, v]) => (
        <div key={k}>
          <h3 className="mb-1 text-sm font-bold">{k}</h3>
          <div className="">
            {v.map((x) => (
              <div
                key={x}
                className="ml-2 flex items-center gap-2 rounded py-0.5 hover:bg-muted"
              >
                <Checkbox name={x} id={x} />
                <label
                  htmlFor={x}
                  className="flex-1 cursor-pointer whitespace-nowrap text-xs"
                >
                  {x}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
