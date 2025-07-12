# 🧠 Valorant 팀 밸런스 시뮬레이터

발로란트 사용자 10명의 티어 정보를 입력하면  
가장 **밸런스가 잘 맞는 5:5 팀 구성 Top 3 조합**을 자동 계산해주는 웹 서비스입니다.

> 공정한 내전 팀 짜기용 툴로, 티어만으로 빠르게 팀 밸런스를 구성할 수 있습니다.

---

## 배포 현황
![GitHub release](https://github.com/junghwaYang/val-team-sim)
![GitHub license](https://github.com/junghwaYang/val-team-sim)

---

## 🚀 기술 스택

- **Next.js 14** (App Router 기반)
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI** – 모던 컴포넌트 UI
- **ESLint** / **Prettier** – 코드 스타일링 & 검사

---

## 📸 주요 기능

| 기능            | 설명                                                              |
| --------------- | ----------------------------------------------------------------- |
| 🎮 티어 입력 UI | 10명의 유저에 대해 티어 + 디비전 선택 (래디언트 제외 디비전 존재) |
| ⚖️ 밸런스 분석  | 점수화된 티어 기반으로 모든 5:5 조합 생성                         |
| 🧠 최적 팀 추천 | 점수차 기준 가장 균형 잡힌 상위 3개 조합 추천                     |
| 🎨 반응형 UI    | Tailwind + ShadCN 기반 UI로 모바일 대응 완료                      |

---

## 📦 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```
