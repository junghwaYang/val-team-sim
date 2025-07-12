import { NextResponse } from 'next/server';

// Riot의 공식 API 응답 구조에 맞는 타입
type RiotMapDto = {
  name: string;
  id: string;
  assetPath: string;
};

// 현재 경쟁전 로테이션에 포함된 맵 목록 (대소문자, 공백 무시)
// 이 목록은 시즌이 바뀔 때 업데이트가 필요할 수 있습니다.
const COMPETITIVE_MAPS = new Set([
  '어센트',
  '바인드',
  '브리즈',
  '아이스박스',
  '로터스',
  '선셋',
  '헤이븐',
  '스플릿',
  // 추후 맵 로테이션 변경 시 여기에 추가/제거
]);

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Riot API 키가 .env.local 파일에 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const url = 'https://kr.api.riotgames.com/val/content/v1/contents?locale=ko-KR';

  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': apiKey,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Riot API 에러: ${response.status} ${errorText}`);
      return NextResponse.json(
        { error: `Riot API에서 데이터를 가져오는 데 실패했습니다: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentData: { maps: RiotMapDto[] } = await response.json();

    const playableMaps = contentData.maps
      // 하드코딩된 경쟁전 맵 목록에 이름이 포함된 맵만 필터링
      .filter(map => map.name && COMPETITIVE_MAPS.has(map.name))
      .map(map => {
        const splashUrl = `https://media.valorant-api.com/maps/${map.id.toLowerCase()}/splash.png`;

        return {
          uuid: map.id,
          displayName: map.name,
          splash: splashUrl,
        };
      });

    return NextResponse.json({ maps: playableMaps });
  } catch (error) {
    console.error('맵 데이터 처리 중 에러 발생:', error);
    return NextResponse.json({ error: '서버 내부 에러가 발생했습니다.' }, { status: 500 });
  }
}
