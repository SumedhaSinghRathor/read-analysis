import { useContext, useState } from "react";
import ReadContext from "../context/ReadContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Pie,
  PieChart,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import Reads from "./Reads";

function Display() {
  const { selectedContent } = useContext(ReadContext);
  const card = "bg-white rounded-2xl shadow-md p-4 border border-indigo-100";
  const page_count = selectedContent
    .flatMap((read) => read.page_count)
    .filter((val) => typeof val === "number" && !isNaN(val));

  const duration = selectedContent
    .map((a) => {
      const start = new Date(a.start_date);
      const finish = new Date(a.finish_date);

      if (isNaN(start) || isNaN(finish)) return null;

      return finish - start;
    })
    .filter((val) => val !== null);

  const totalDuration = duration.reduce((sum, r) => sum + r, 0);
  const avgDuration = duration.length
    ? (totalDuration / duration.length / 1000 / 86400).toFixed(3)
    : 0;

  const sumPages = selectedContent.reduce(
    (sum, r) => sum + (r.page_count || 0),
    0,
  );

  const avgLength = page_count.length
    ? (sumPages / page_count.length).toFixed(2)
    : 0;

  const allDemos = selectedContent.flatMap((read) => read.demographic);
  const demoCounts = allDemos.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const demoData = Object.entries(demoCounts)
    .map(([demographic, total_reads]) => ({
      demographic,
      total_reads,
    }))
    .sort((a, b) => a.demographic.localeCompare(b.demographic));

  const allTypes = selectedContent.flatMap((read) => read.book_type);
  const typeCounts = allTypes.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(typeCounts).map(([type, total_reads]) => ({
    type,
    total_reads,
  }));

  const allFiction = selectedContent.flatMap((read) => read.fiction);
  const fictionCounts = allFiction.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const fictionData = Object.entries(fictionCounts).map(
    ([fiction, total_reads]) => ({
      fiction,
      total_reads,
    }),
  );

  const allReads = selectedContent.flatMap((read) => read.reread);
  const reReadsCounts = allReads.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const rereadsData = Object.entries(reReadsCounts).map(
    ([reread, total_reads]) => ({
      reread,
      total_reads,
    }),
  );

  const allRatings = selectedContent
    .flatMap((read) => read.rating)
    .filter((rating) => rating !== null);
  const ratingCounts = allRatings.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const ratingData = Object.entries(ratingCounts)
    .map(([rating, total_reads]) => ({
      rating: parseFloat(rating),
      total_reads,
    }))
    .sort((a, b) => a.rating - b.rating);

  const allAuthors = selectedContent.flatMap((read) => read.author);
  const authorCounts = allAuthors.reduce((acc, read) => {
    acc[read] = (acc[read] || 0) + 1;
    return acc;
  }, {});
  const authorData = Object.entries(authorCounts)
    .map(([author, total_reads]) => ({
      author,
      total_reads,
    }))
    .sort((a, b) => b.total_reads - a.total_reads)
    .slice(0, 10);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthCounts = Array(12).fill(0);
  const monthPageCounts = Array(12).fill(0);

  selectedContent.forEach((read) => {
    const date = new Date(read.finish_date);
    if (!isNaN(date)) {
      const month = date.getMonth();
      monthCounts[month] += 1;
      monthPageCounts[month] += read.page_count || 0;
    }
  });

  const monthsData = monthCounts.map((count, i) => ({
    month: monthNames[i],
    total_reads: count,
    total_pages: monthPageCounts[i],
  }));

  const [showModal, setShowModal] = useState(false);

  return (
    <section>
      <section className="grid grid-cols-3 text-center gap-4 m-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all"
        >
          Total Reads:{" "}
          <b>
            {selectedContent.filter((r) => r.reread === false).length} books (+{" "}
            {selectedContent.filter((r) => r.reread === true).length} rereads)
          </b>
        </button>
        <div className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all">
          Max Length: <b>{Math.max(...page_count)} pages</b>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all">
          Min Length: <b>{Math.min(...page_count)} pages</b>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all">
          Avg Length: <b>{avgLength} pages</b>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all">
          Total Length: <b>{sumPages.toLocaleString("en-IN")} pages</b>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 shadow-sm hover:ring-indigo-600 hover:ring-2 transition-all">
          Avg Duration: <b>{avgDuration} days</b>
        </div>
        {showModal && (
          <Reads
            selectedContent={selectedContent}
            onClose={() => setShowModal(false)}
          />
        )}
      </section>
      <section className="grid grid-cols-3 gap-4 m-4">
        <div className={`${card} col-span-2`}>
          <BarChart data={demoData} style={{ aspectRatio: 2, width: "100%" }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Bar dataKey="total_reads" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <XAxis dataKey="demographic" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </div>

        <div className={card}>
          <PieChart style={{ aspectRatio: 1, width: "100%" }}>
            <Pie
              data={typeData}
              dataKey="total_reads"
              nameKey="type"
              fill="#6366f1"
            />
            <Legend />
            <Tooltip />
          </PieChart>
        </div>

        <div className={card}>
          <PieChart style={{ aspectRatio: 1, width: "100%" }}>
            <Pie
              data={fictionData}
              dataKey="total_reads"
              nameKey="fiction"
              outerRadius={170}
              innerRadius={120}
              fill="#10b981"
            />
            <Legend />
            <Tooltip />
          </PieChart>
        </div>

        <div className={`${card} col-span-2`}>
          <BarChart data={ratingData} style={{ aspectRatio: 2, width: "100%" }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Bar dataKey="total_reads" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </div>

        <div className={`${card} col-span-3`}>
          <BarChart
            layout="vertical"
            data={authorData}
            style={{ width: "100%", aspectRatio: 3 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Bar dataKey="total_reads" fill="#6366f1" radius={[0, 6, 6, 0]} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="author" />
            <Tooltip />
          </BarChart>
        </div>

        <div className={`${card} col-span-3`}>
          <ComposedChart
            data={monthsData}
            style={{ width: "100%", aspectRatio: 3 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Area
              yAxisId="left"
              type="monotoneX"
              dataKey="total_reads"
              name="Total Reads"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
            />
            <Bar
              yAxisId="right"
              dataKey="total_pages"
              name="Total Pages"
              fill="#10b981"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
          </ComposedChart>
        </div>
      </section>
    </section>
  );
}

export default Display;
