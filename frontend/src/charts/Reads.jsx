import { useContext, useRef } from "react";
import ReadContext from "../context/ReadContext";

function Reads({ onClose, selectedContent }) {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };
  const { selectedYears } = useContext(ReadContext);

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
            {selectedContent
              .sort((a, b) => a.finish_date - b.finish_date)
              .map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-200">
                  <td>{r.title}</td>
                  <td>{r.demographic}</td>
                  <td>{r.reread && <i className="bx bx-repost" />}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Reads;
