'use client';

import { useState } from 'react';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const tiers = [
  '아이언',
  '브론즈',
  '실버',
  '골드',
  '플래티넘',
  '다이아',
  '초월자',
  '불멸',
  '래디언트',
];
const divisions = ['1', '2', '3'];

export default function Home() {
  const [players, setPlayers] = useState(Array(10).fill({ tier: '브론즈', div: '1' }));
  const [results, setResults] = useState<any[]>([]);

  const handleChange = (index: number, field: 'tier' | 'div', value: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players }),
    });
    const data = await res.json();
    setResults(data.topMatches);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">발로란트 팀 밸런스 시뮬레이터</h1>
      <div className="flex flex-wrap justify-between gap-y-2">
        {players.map((p, i) => (
          <div key={i} className="flex gap-2 items-center w-1/2">
            <span className="w-24">Player {i + 1}</span>
            <Select value={p.tier} onValueChange={value => handleChange(i, 'tier', value)}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="티어 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>티어</SelectLabel>
                  {tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {p.tier !== '래디언트' && (
              <Select value={p.div} onValueChange={value => handleChange(i, 'div', value)}>
                <SelectTrigger className="w-1/4">
                  <SelectValue placeholder="디비전 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>디비전</SelectLabel>
                    {divisions.map(d => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit} className="w-full">
        밸런스 조정
      </Button>
      {results.length > 0 && (
        <Button
          onClick={() => {
            setPlayers(Array(10).fill({ tier: '브론즈', div: '1' }));
            setResults([]);
          }}
          className="w-full"
        >
          다시하기
        </Button>
      )}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Top 3 조합</h2>
          {results.map((match, idx) => (
            <div key={idx} className="border p-2 mt-2 bg-gray-50 rounded">
              <strong>#{idx + 1}</strong> 점수차: {match.diff}
              <div className="mt-1">A팀: {match.teamA.join(', ')}</div>
              <div>B팀: {match.teamB.join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
