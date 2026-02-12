import { useRef, useState, useEffect } from "react";

function Form({ onClose }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };

  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const bookTypes = [
    "Novel",
    "Novella",
    "Short Story",
    "Memoir",
    "Manga",
    "Graphic Novel",
    "Anthology",
  ];
  const [bookType, setBookType] = useState("Novel");
  const [pageCount, setPageCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const demos = [
    "Adult",
    "Young Adult",
    "Middle Grade",
    "Shounen",
    "Shoujo",
    "Josei",
    "Seinen",
  ];
  const [demographic, setDemographic] = useState("Young Adult");
  const [rating, setRating] = useState(null);
  const handleRating = (starIndex, isLeftHalf) => {
    const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(newRating);
  };
  const [standAlone, setStandAlone] = useState(true);
  const [partOfSeries, setPartOfSeries] = useState(null);
  const [fiction, setFiction] = useState(true);

  useEffect(() => {
    const fetchReads = async () => {
      if (title.trim().length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error("Failed to fetch reads");

        const data = await response.json();

        const matches = data.filter((m) =>
          m.title.toLowerCase().includes(title.toLocaleLowerCase()),
        );

        if (matches.some((m) => m.title === title)) {
          setShowDropdown(false);
        }

        setResults(matches.slice(0, 3));
        setShowDropdown(true);
      } catch (error) {
        console.error("Failed to fetch reads: ", error);
        setResults([]);
      }
    };

    fetchReads();
  }, [title, API_URL]);

  const fillFormFromRead = (read) => {
    setTitle(read.title || "");
    setAuthor(read.author || "");
    setBookType(read.book_type || "Novel");
    setDemographic(read.demographic || "Young Adult");
    setFiction(read.fiction ?? true);

    setPageCount(read.page_count ?? 0);
    setStartDate(read.start_date || "");
    setFinishDate(read.finish_date || "");
    setRating(read.rating ?? null);

    if (read.standalone) {
      setStandAlone(true);
      setPartOfSeries("");
    } else {
      setStandAlone(false);
      setPartOfSeries(read.partOfSeries || "");
    }

    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const readData = {
      title,
      author,
      book_type: bookType,
      page_count: pageCount,
      rating,
      start_date: startDate,
      finish_date: finishDate,
      demographic,
      standalone: standAlone,
      partofseries: partOfSeries,
      fiction,
    };

    try {
      const response = await fetch(`${API_URL}/post-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readData),
      });

      if (!response.ok) throw new Error("Failed to add read");

      alert("Read added successfully");
      onClose();

      setAuthor("");
      setBookType("Novel");
      setDemographic("Young Adult");
      setFiction(true);
      setFinishDate("");
      setPageCount(0);
      setPartOfSeries(null);
      setRating(null);
      setStandAlone(true);
      setStartDate("");
      setTitle("");

      window.location.reload();
    } catch (error) {
      console.error("Error entering read data: ", error);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 flex justify-center items-center bg-indigo-400/35 backdrop-blur-sm z-10"
    >
      <section className="bg-white w-3xl text-base p-8 rounded-2xl font-normal border">
        <h1 className="text-2xl font-semibold">Enter Your Last Read</h1>
        <hr className="my-2" />
        <form
          action=""
          className="grid grid-cols-2 gap-2"
          onSubmit={handleSubmit}
        >
          <label htmlFor="" className="relative">
            Title: <br />
            <input
              type="text"
              required
              className="w-full border rounded px-2 py-1 text-sm font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {showDropdown && results.length > 0 && (
              <ul className="absolute w-full bg-white border-x shadow-2xl">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="border-b p-1 hover:bg-slate-300"
                    onClick={() => fillFormFromRead(item)}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <label htmlFor="">
            Author: <br />
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-medium"
            />
          </label>
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <label htmlFor="">
              Book Type: <br />
              <select
                className="w-full border rounded px-2 py-1 text-sm font-medium"
                required
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
              >
                {bookTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              Demographic: <br />
              <select
                className="w-full border rounded px-2 py-1 text-sm font-medium"
                required
                value={demographic}
                onChange={(e) => setDemographic(e.target.value)}
              >
                {demos.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              Page Count: <br />
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 text-sm font-medium"
              />
            </label>
          </div>
          <label htmlFor="">
            Start Date: <br />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-medium"
            />
          </label>
          <label htmlFor="">
            Finish Date: <br />
            <input
              type="date"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-medium"
            />
          </label>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-2">
            {bookType !== "Manga" && (
              <div className="flex flex-col items-center gap-2">
                Rating
                <div className="flex items-center gap-1" aria-label="Rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      index={index}
                      rating={rating}
                      onRatingChange={handleRating}
                    />
                  ))}
                  <div className="ml-2 text-sm text-gray-700">
                    {rating ? rating : "—"}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Click left/right half for halves
                </div>
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              Series
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStandAlone(true)}
                  className={`px-3 py-1 rounded-full ${standAlone ? "bg-indigo-600 text-white border-indigo-700" : "bg-indigo-50 text-indigo-800 border-indigo-200"}`}
                >
                  Standalone
                </button>
                <button
                  type="button"
                  onClick={() => setStandAlone(false)}
                  className={`px-3 py-1 rounded-full ${!standAlone ? "bg-indigo-600 text-white border-indigo-700" : "bg-indigo-50 text-indigo-800 border-indigo-200"}`}
                >
                  Series
                </button>
              </div>
              {!standAlone && (
                <input
                  type="text"
                  placeholder="Series title"
                  className="w-full mt-1 text-sm border rounded px-2 py-1"
                  value={partOfSeries}
                  onChange={(e) => setPartOfSeries(e.target.value)}
                />
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              Type
              <div>
                <button
                  type="button"
                  onClick={() => setFiction(true)}
                  className={`px-3 py-1 rounded-full mr-2 ${fiction ? "bg-indigo-600 text-white border-indigo-700" : "bg-indigo-50 text-indigo-800 border-indigo-200"}`}
                >
                  Fiction
                </button>
                <button
                  type="button"
                  onClick={() => setFiction(false)}
                  className={`px-3 py-1 rounded-full ${!fiction ? "bg-indigo-600 text-white border-indigo-700" : "bg-indigo-50 text-indigo-800 border-indigo-200"}`}
                >
                  Non-Fiction
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 col-span-2 font-semibold text-xl py-1 w-3/4 mx-auto rounded-full active:bg-indigo-50 active:text-indigo-800 active:border-indigo-200 active:hover:bg-indigo-100"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}

const Star = ({ index, rating, onRatingChange }) => {
  const handleLeftHalfClick = (e) => {
    e.stopPropagation();
    onRatingChange(index, true);
  };
  const handleRightHalfClick = (e) => {
    e.stopPropagation();
    onRatingChange(index, false);
  };

  const isFullStar = rating >= index + 1;
  const isHalfStar = rating >= index + 0.5 && rating < index + 1;
  const starClass = isFullStar
    ? "bxs-star"
    : isHalfStar
      ? "bxs-star-half"
      : "bx-star";

  return (
    <div className="relative text-2xl flex justify-center items-center select-none">
      <i
        className={`bx ${starClass} text-black transition-colors duration-150`}
        aria-hidden="true"
      />
      <button
        type="button"
        aria-label={`Set rating ${index + 0.5}`}
        className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
        onClick={handleLeftHalfClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleLeftHalfClick(e);
        }}
      />
      <button
        type="button"
        aria-label={`Set rating ${index + 1}`}
        className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
        onClick={handleRightHalfClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleRightHalfClick(e);
        }}
      />
    </div>
  );
};

export default Form;
