import { NextRequest } from 'next/server';

const tierBase: Record<string, number> = {
  아이언: 1,
  브론즈: 2,
  실버: 3,
  골드: 4,
  플래티넘: 5,
  다이아: 6,
  초월자: 7,
  불멸: 8,
  래디언트: 9,
};

function tierToScore(tier: string, div?: string) {
  const base = tierBase[tier] || 0;
  const offset = tier !== '래디언트' && div ? (4 - parseInt(div)) * 0.1 : 0;
  return base + offset;
}

export async function POST(req: NextRequest) {
  const { players } = await req.json();

  const enriched = players.map((p: any) => ({
    tier: p.tier,
    name: p.tier + (p.tier !== '래디언트' ? p.div : ''),
    score: tierToScore(p.tier, p.div),
  }));

  const combinations = (arr: any[], size: number) => {
    if (size === 0) return [[]];
    if (!arr.length) return [];
    const [first, ...rest] = arr;
    const withFirst = combinations(rest, size - 1).map((comb: any) => [first, ...comb]);
    const withoutFirst = combinations(rest, size);
    return withFirst.concat(withoutFirst);
  };

  const combos = combinations(enriched, 5);
  const matches = combos
    .map((teamA: any[]) => {
      const teamB = enriched.filter((p: any) => !teamA.includes(p));
      const sumA = teamA.reduce((acc: any, p: { score: any }) => acc + p.score, 0);
      const sumB = teamB.reduce((acc: any, p: { score: any }) => acc + p.score, 0);
      return {
        teamA: teamA.map((p: { name: any }) => p.name),
        teamB: teamB.map((p: { name: any }) => p.name),
        diff: Math.abs(sumA - sumB).toFixed(2),
      };
    })
    .sort((a: { diff: string }, b: { diff: string }) => parseFloat(a.diff) - parseFloat(b.diff));

  return new Response(JSON.stringify({ topMatches: matches.slice(0, 3) }), { status: 200 });
}
