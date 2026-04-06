import type { TeacherData } from "@/data/teacherData";

export function VariableTable({ data }: { data: TeacherData[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            {["姓名","瀏覽數(Y)","字數","職級","性別","照片清晰度","外在感知","研究領域數","資料充足性","笑容程度","頭銜數量","名字長度"].map(h => (
              <th key={h} className="px-3 py-2 text-left whitespace-nowrap font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((t, i) => (
            <tr key={t.name} className={i % 2 === 0 ? "bg-card" : "bg-muted/50"}>
              <td className="px-3 py-2 font-medium">
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t.name}</a>
              </td>
              <td className="px-3 py-2 font-bold text-accent">{t.views.toLocaleString()}</td>
              <td className="px-3 py-2">{t.wordCount.toLocaleString()}</td>
              <td className="px-3 py-2">{t.rank}</td>
              <td className="px-3 py-2">{t.gender}</td>
              <td className="px-3 py-2">{t.photoClarity}</td>
              <td className="px-3 py-2">{t.appearance}</td>
              <td className="px-3 py-2">{t.researchCount}</td>
              <td className="px-3 py-2">{t.infoScore}</td>
              <td className="px-3 py-2">{t.smileScore}</td>
              <td className="px-3 py-2">{t.titleCount}</td>
              <td className="px-3 py-2">{t.nameLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
