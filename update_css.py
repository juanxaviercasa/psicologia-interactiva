with open('css/styles.css', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

additions = """

/* ============================================
   FLASHCARD 3D FLIP
   ============================================ */
.flip-card-container {
  width: 100%;
  height: 280px;
  perspective: 1200px;
  cursor: pointer;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  border: 1px solid #1e293b;
}
.flip-card-front {
  background: linear-gradient(135deg, #0f172a, #1e293b);
}
.flip-card-back {
  background: linear-gradient(135deg, #1e1b4b, #0f172a);
  border-color: #6366f1;
  transform: rotateY(180deg);
}

/* ============================================
   CUSTOM SCROLLBAR
   ============================================ */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.4); border-radius: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.8); }

/* ============================================
   TOAST ANIMATION
   ============================================ */
@keyframes slide-in-from-bottom-5 {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-in { animation-duration: 300ms; animation-fill-mode: both; }
.slide-in-from-bottom-5 { animation-name: slide-in-from-bottom-5; }

@keyframes zoom-in-95 {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.zoom-in-95 { animation-name: zoom-in-95; }

/* ============================================
   MISC
   ============================================ */
.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
}

.nav-tab.active {
  background: rgba(6, 182, 212, 0.08);
  color: #22d3ee;
}

@media print {
  header, nav, footer, .no-print { display: none !important; }
  #view-glossary { display: block !important; }
}
"""

if 'flip-card-container' not in content:
    content += additions
    with open('css/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CSS updated")
else:
    print("CSS already has flip cards")
