import { createContext, useEffect, useState } from "react";
import Form from "../charts/Form";

const ReadContext = createContext();
const readingYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export const ReadProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [reads, setReads] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReads = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error("Failed to fetch reads");

        const data = await response.json();
        setReads(data);
      } catch (error) {
        console.error("Failed to fetch reads: ", error);
      }
    };

    fetchReads();
  }, [API_URL]);

  const [selectedYears, setSelectedYears] = useState(readingYears);
  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const dblToggleYear = (year) => {
    setSelectedYears([year]);
  };

  const selectedReads = reads.filter((r) => {
    if (!r.finish_date) return false;

    const year = new Date(r.finish_date).getFullYear();
    return selectedYears.includes(year);
  });

  const [type, setType] = useState(["Books", "Manga"]);
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
    <ReadContext.Provider value={{ selectedContent, selectedYears }}>
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
