import type { TeacherData } from "@/data/teacherData";

const rankings = [
  { key: "researchCount" as const, label: "🔬 研究領域最多", unit: "個" },
  { key: "infoScore" as const, label: "📋 資料最充足", unit: "分" },
  { key: "smileScore" as const, label: "😊 笑得最開心", unit: "分" },
  { key: "titleCount" as const, label: "🎖️ 頭銜最多", unit: "個" },
  { key: "nameLength" as const, label: "📝 名字長度", unit: "字" },
];

export function CreativeRankings({ data }: { data: TeacherData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rankings.map(({ key, label, unit }) => {
        const sorted = [...data].sort((a, b) => (b[key] as number) - (a[key] as number));
        const top3 = sorted.slice(0, 3);

        return (
          <div key={key} className="bg-card rounded-lg border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">{label}</h3>
            <div className="space-y-2">
              {top3.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                    <span className="text-sm font-medium">{t.name}</span>
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {(t[key] as number)} {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
