import CsvImport from "@/components/CsvImport";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Import prospects</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Upload a CSV with columns{" "}
        <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-800">
          name, city, rating, review_count, competitor, competitor_reviews, phone, email, notes
        </code>
        . Businesses are created in the Prospect stage; rating + review_count become an initial snapshot.
      </p>
      <CsvImport />
    </div>
  );
}
