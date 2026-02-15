import { useContext, useRef, useState } from "react";
import ReadContext from "../context/ReadContext";

function Reads({ onClose, selectedContent }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };
  const { selectedYears } = useContext(ReadContext);
  const [isShown, setIsShown] = useState(null);

  function daysBetweenDates(start, finish) {
    const timeDifference =
      new Date(finish).getTime() - new Date(start).getTime();

    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + " days";
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete-read/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete Failed");

      if (!window.confirm("Delete this read?")) return;
    } catch (error) {
      console.error("Delete error: ", error);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 p-8 flex justify-center items-center bg-indigo-400/35 backdrop-blur-sm z-10"
    >
      <section className="bg-white w-full h-full overflow-y-scroll p-4">
        <table className="w-full text-start">
          <thead>
            <tr>
              <th colSpan={2}>{selectedYears.join(", ")} Reads</th>
            </tr>
          </thead>
          <tbody>
            {[...selectedContent]
              .sort((a, b) => new Date(a.finish_date) - new Date(b.finish_date))
              .map((r) => (
                <tr
                  key={r.id}
                  onMouseEnter={() => setIsShown(r.id)}
                  onMouseLeave={() => setIsShown(null)}
                  className="border-b hover:bg-gray-200"
                >
                  <td>{r.title}</td>
                  <td>{r.reread && <i className="bx bx-repost" />}</td>
                  <td>{daysBetweenDates(r.start_date, r.finish_date)}</td>
                  <td>{r.demographic}</td>
                  <td>
                    <i
                      className={`bx bx-x ${isShown === r.id ? "" : "hidden"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Reads;
