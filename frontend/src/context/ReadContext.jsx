import { createContext, useState } from "react";
import reads2020 from "../assets/reads2020.json";
import reads2021 from "../assets/reads2021.json";
import reads2022 from "../assets/reads2022.json";
import reads2023 from "../assets/reads2023.json";
import reads2024 from "../assets/reads2024.json";
import reads2025 from "../assets/reads2025.json";
import reads2026 from "../assets/reads2026.json";
import Form from "../charts/Form";

const ReadContext = createContext();
const readingYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export const ReadProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const [selectedYears, setSelectedYears] = useState(readingYears);
  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const dblToggleYear = (year) => {
    setSelectedYears([year]);
  };

  const datasets = {
    2020: reads2020,
    2021: reads2021,
    2022: reads2022,
    2023: reads2023,
    2024: reads2024,
    2025: reads2025,
    2026: reads2026,
  };

  const [type, setType] = useState(["Books", "Manga"]);
  const selectedReads = selectedYears.flatMap((y) => datasets[y] || []);
  let selectedContent;
  if (type.includes("Books") && type.includes("Manga")) {
    selectedContent = selectedReads;
  } else if (type.includes("Books")) {
    selectedContent = selectedReads.filter((r) => r.book_type !== "Manga");
  } else if (type.includes("Manga")) {
    selectedContent = selectedReads.filter((r) => r.book_type === "Manga");
  } else {
    selectedContent = [];
  }

  return (
    <ReadContext.Provider value={{ selectedContent }}>
      <section className="grid grid-cols-7 m-4 gap-2 text-xl font-semibold">
        {["Books", "Manga"].map((t) => (
          <button
            key={t}
            title="Click to include / exclude"
            className={`rounded-full col-span-3 border font-semibold transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${type.includes(t) ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700" : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"}`}
            onClick={() =>
              type.includes(t)
                ? setType(type.filter((ty) => ty !== t))
                : setType([...type, t])
            }
            type=""
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setShowModal(true)}
          title="Add a Read"
          className="rounded-full border font-semibold transition-all duration-200 ease-in-out shadow-sm hover:shadow-md bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
        >
          +
        </button>
        {showModal && <Form onClose={() => setShowModal(false)} />}
      </section>
      <section>
        <section className="grid grid-cols-7 text-center text-3xl m-4 gap-2">
          {readingYears.map((y) => {
            const active = selectedYears.includes(y);
            const single = selectedYears.length === 1 && active;

            return (
              <button
                key={y}
                onClick={() => toggleYear(y)}
                onDoubleClick={() => dblToggleYear(y)}
                title="Click to exclude / Double click for only this year"
                className={`rounded-xl border font-semibold py-3 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                    : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                } ${single ? "ring-4 ring-indigo-300" : ""}
              `}
              >
                {y}
              </button>
            );
          })}
        </section>
      </section>
      {children}
    </ReadContext.Provider>
  );
};

export default ReadContext;
