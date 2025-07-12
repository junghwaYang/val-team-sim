'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';

// API가 보내주는 데이터에 맞춰 타입 정의를 간결하게 수정
type Map = {
  uuid: string;
  displayName: string;
  splash: string;
};

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
  // 랜덤 맵 선택기를 위한 상태 추가
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const resetSimulator = () => {
    setPlayers(Array(10).fill({ tier: '브론즈', div: '1' }));
    setResults([]);
  };

  // 맵 데이터를 불러오는 함수
  const fetchMaps = async () => {
    setIsLoadingMaps(true);
    setError(null);
    setSelectedMap(null);
    try {
      const res = await fetch('/api/maps');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '맵 데이터를 불러오지 못했습니다.');
      }
      const data = await res.json();
      console.log(data.maps);
      setMaps(data.maps);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingMaps(false);
    }
  };

  // 맵 목록에서 랜덤으로 하나를 선택하는 함수
  const pickRandomMap = () => {
    if (maps.length > 0) {
      const randomIndex = Math.floor(Math.random() * maps.length);
      setSelectedMap(maps[randomIndex]);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulator">밸런스 시뮬레이터</TabsTrigger>
          <TabsTrigger value="tab2">랜덤 맵 선택기</TabsTrigger>
        </TabsList>
        <TabsContent value="simulator">
          <Card>
            <CardHeader>
              <CardTitle>발로란트 팀 밸런스 시뮬레이터</CardTitle>
              <CardDescription>
                10명의 플레이어 티어를 설정하고 최적의 팀 조합을 찾아보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {players.map((p, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className="font-medium w-24 text-sm">Player {i + 1}</span>
                    <Select value={p.tier} onValueChange={value => handleChange(i, 'tier', value)}>
                      <SelectTrigger className="w-32">
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
                        <SelectTrigger className="w-32">
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
              {results.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Top 3 조합</h3>
                  <div className="space-y-2">
                    {results.map((match, idx) => (
                      <div key={idx} className="border p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center font-bold">
                          <span>#{idx + 1}</span>
                          <span className="text-sm text-muted-foreground">
                            점수차: {match.diff}
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <p>
                            <span className="font-semibold">A팀:</span> {match.teamA.join(', ')}
                          </p>
                          <p>
                            <span className="font-semibold">B팀:</span> {match.teamB.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button onClick={handleSubmit} className="w-full">
                밸런스 조정
              </Button>
              {results.length > 0 && (
                <Button onClick={resetSimulator} className="w-full" variant="outline">
                  다시하기
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="tab2">
          <Card>
            <CardHeader>
              <CardTitle>랜덤 맵 선택기</CardTitle>
              <CardDescription>어떤 맵을 플레이할지 고민될 때 버튼을 눌러보세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              {error && <p className="text-destructive">{error}</p>}

              {selectedMap && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-2xl font-bold tracking-tighter">{selectedMap.displayName}</h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={selectedMap.splash}
                      alt={`${selectedMap.displayName} splash art`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              )}

              {maps.length > 0 && !selectedMap && (
                <div className="text-muted-foreground">
                  <p>맵 목록을 불러왔습니다!</p>
                  <p>아래 버튼을 눌러 랜덤 맵을 선택하세요.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {maps.length === 0 ? (
                <Button onClick={fetchMaps} disabled={isLoadingMaps} className="w-full">
                  {isLoadingMaps ? '맵 불러오는 중...' : '맵 목록 불러오기'}
                </Button>
              ) : (
                <Button onClick={pickRandomMap} className="w-full">
                  랜덤 맵 선택!
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
