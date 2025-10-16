import { useEffect, useMemo, useState } from "react";
import "./index.css";

// 갤러리 데이터 (원하는 이미지로 교체)
const sampleItems = [
  { id: "tutle", title: "Busan Sunset", src: "images/tutle.jpg", type: "illustration", tags: ["sunset","sea","Busan"] },
  { id: "dodo", title: "Character Design Practice", src: "images/dodo.jpg", type: "illustration", tags: ["character","illustration"] },
  { id: "gogo", title: "Webtoon Cut #1", src: "images/gogo.jpg", type: "illustration", tags: ["episode1","cut"] },
];

function App() {
  // 보기: gallery | about | contact (URL 고정, 내부 상태로만 전환)
  const [view, setView] = useState("gallery");

  // 갤러리 상태
  const [query, setQuery] = useState("");
  const [lightboxItem, setLightboxItem] = useState(null);

  // 검색 필터
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleItems.filter(
      (item) =>
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  // 라이트박스 열기/이전/다음
  const openAt = (id) => {
    const item = filtered.find((i) => i.id === id) || sampleItems.find((i) => i.id === id);
    if (item) setLightboxItem(item);
  };
  const goPrev = () => {
    if (!lightboxItem) return;
    const idx = filtered.findIndex((i) => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx - 1 + filtered.length) % filtered.length]);
  };
  const goNext = () => {
    if (!lightboxItem) return;
    const idx = filtered.findIndex((i) => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx + 1) % filtered.length]);
  };

  // 키보드 ← → ESC
  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxItem(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxItem, filtered]);

  // 오른쪽 클릭 방지 (원치 않으면 제거)
  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-800 flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            bluespace
          </h1>

          {/* 내부 탭은 <button>으로만! (URL 절대 안변함) */}
          <nav className="mt-2 text-sm text-gray-500 space-x-6">
            <button
              type="button"
              onClick={() => setView("gallery")}
              className={
                view === "gallery"
                  ? "text-gray-900 underline underline-offset-4"
                  : "hover:text-gray-700"
              }
            >
              메인
            </button>
            <button
              type="button"
              onClick={() => setView("about")}
              className={
                view === "about"
                  ? "text-gray-900 underline underline-offset-4"
                  : "hover:text-gray-700"
              }
            >
              소개
            </button>
            <button
              type="button"
              onClick={() => setView("contact")}
              className={
                view === "contact"
                  ? "text-gray-900 underline underline-offset-4"
                  : "hover:text-gray-700"
              }
            >
              문의
            </button>
          </nav>
        </div>
      </header>

      {/* Views */}
      {view === "gallery" && (
        <main className="flex-grow mx-auto max-w-6xl px-4 pb-12">
          <div className="flex justify-end mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색 (title, #tags)"
              className="px-3 py-1.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-20">해당 조건의 작품이 없습니다.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {filtered.map((it) => (
                <figure
                  key={it.id}
                  style={{ breakInside: "avoid" }}
                  className="mb-6 overflow-hidden rounded-xl"
                >
                  <button
                    onClick={() => openAt(it.id)}
                    className="block w-full group cursor-zoom-in"
                    aria-label={`${it.title} 확대 보기`}
                  >
                    <div style={{ aspectRatio: "1 / 1" }} className="w-full">
                      <img
                        src={it.src}
                        alt={it.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] rounded-xl shadow-md"
                      />
                    </div>
                  </button>
                </figure>
              ))}
            </div>
          )}
        </main>
      )}

      {view === "about" && (
        <main className="flex-grow mx-auto max-w-3xl px-6 pb-16">
          <section className="text-center">
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="w-36 h-36 mx-auto rounded-full object-cover shadow-md mb-6 select-none pointer-events-none"
              draggable={false}
            />
            <h2 className="text-2xl font-semibold mb-2">안녕하세요, bluespace 입니다.</h2>
            <p className="text-gray-600 leading-7">
              일러스트와 웹툰 컷을 중심으로 작업하고 있어요. 밝은 색감과 리듬 있는 구도를 좋아합니다.
              현재는 개인 프로젝트와 프리랜스 작업을 병행 중이며, 브랜딩/출판/웹툰 시각화에 관심이 많습니다.
              이 사이트에는 최근 작업을 선별해 담았습니다.
            </p>

            {/* 외부 링크는 https:// 또는 mailto: 로! */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href="mailto:o0o0o5959@naver.com"
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50"
              >
                이메일
              </a>
              <a
                href="https://www.youtube.com/@o0o0o59"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50"
              >
                유튜브
              </a>
              <a
                href="https://deviantart.com/o0o0o5959"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50"
              >
                데비안아트
              </a>
            </div>
          </section>
        </main>
      )}

      {view === "contact" && (
        <main className="flex-grow mx-auto max-w-md px-6 pb-16 text-center">
          <h2 className="text-xl font-semibold mb-4">문의</h2>
          <p className="text-gray-600">작업 의뢰 및 협업 문의는 아래로 보내주세요.</p>
          <div className="mt-4 space-y-2">
            <a href="mailto:o0o0o5959@naver.com" className="underline">
              o0o0o5959@naver.com
            </a>
            <div>
              <a
                href="https://www.youtube.com/@o0o0o59"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                www.youtube.com/@o0o0o59
              </a>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-500">
        © 2025 bluespace
      </footer>

      {/* Lightbox (갤러리에서만) */}
      {view === "gallery" && lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-default"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxItem(null); }}
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300"
          >
            &times;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-6 text-white text-4xl hover:text-gray-300 select-none"
          >
            &#10094;
          </button>
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center text-center">
            <img
              src={lightboxItem.src}
              alt={lightboxItem.title}
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-sm">
              {lightboxItem.title}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-6 text-white text-4xl hover:text-gray-300 select-none"
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
