/**
 * BIBLIOTECA_ENGINE - BÚNKER DIGITAL DE 94 LIBROS
 * Catálogo interactivo de lectura, búsqueda instantánea, filtrado por categorías,
 * visor modal de lectura In-App de PDFs y gestión de favoritos.
 */

const BibliotecaEngine = {
  books: [],
  activeCategory: 'all',
  searchQuery: '',
  formatFilter: 'all',
  viewMode: 'grid', // 'grid' | 'list'
  favorites: [],
  currentReadingBook: null,
  storageKey: 'psicologia_biblioteca_favs',

  init() {
    if (typeof COLECCION_DATA === 'undefined') return;
    this.books = COLECCION_DATA.books || [];
    this.loadFavorites();
    this.renderCategoryTabs();
    this.renderBooks();
    this.setupModalEvents();
  },

  loadFavorites() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.favorites = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.favorites = [];
    }
  },

  saveFavorites() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    } catch (e) {}
  },

  toggleFavorite(bookId) {
    const idx = this.favorites.indexOf(bookId);
    if (idx === -1) {
      this.favorites.push(bookId);
    } else {
      this.favorites.splice(idx, 1);
    }
    this.saveFavorites();
    this.renderBooks();
  },

  isFavorite(bookId) {
    return this.favorites.includes(bookId);
  },

  setupModalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeReaderModal();
      }
    });
  },

  renderCategoryTabs() {
    const container = document.getElementById('bibliotecaCategoryTabs');
    if (!container || typeof COLECCION_DATA === 'undefined') return;

    const categories = COLECCION_DATA.meta.categories.filter(c => c.id !== 'audiolibros');
    const totalBooks = this.books.length;

    let html = `
      <button onclick="BibliotecaEngine.filterCategory('all')" data-category="all" class="book-cat-pill px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
        <i class="fa-solid fa-layer-group mr-1.5"></i> Todos (${totalBooks})
      </button>
      <button onclick="BibliotecaEngine.filterCategory('favorites')" data-category="favorites" class="book-cat-pill px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800">
        <i class="fa-solid fa-star text-amber-400 mr-1.5"></i> Favoritos (<span id="favCountBadge">${this.favorites.length}</span>)
      </button>
    `;

    categories.forEach(cat => {
      const count = this.books.filter(b => b.categoryKey === cat.id).length;
      html += `
        <button onclick="BibliotecaEngine.filterCategory('${cat.id}')" data-category="${cat.id}" class="book-cat-pill px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800">
          <i class="fa-solid ${cat.icon} mr-1.5 text-slate-400"></i> ${cat.shortName} (${count})
        </button>
      `;
    });

    container.innerHTML = html;
  },

  filterCategory(catKey) {
    this.activeCategory = catKey;
    document.querySelectorAll('.book-cat-pill').forEach(pill => {
      if (pill.dataset.category === catKey) {
        pill.className = 'book-cat-pill px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20';
      } else {
        pill.className = 'book-cat-pill px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800';
      }
    });
    this.renderBooks();
  },

  filterFormat(format) {
    this.formatFilter = format;
    document.querySelectorAll('.format-filter-btn').forEach(btn => {
      if (btn.dataset.format === format) {
        btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-900', 'text-slate-400');
      } else {
        btn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.add('bg-slate-900', 'text-slate-400');
      }
    });
    this.renderBooks();
  },

  searchBooks(query) {
    this.searchQuery = query;
    this.renderBooks();
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const gridBtn = document.getElementById('viewModeGridBtn');
    const listBtn = document.getElementById('viewModeListBtn');
    if (mode === 'grid') {
      gridBtn?.classList.add('bg-cyan-500', 'text-slate-950');
      gridBtn?.classList.remove('text-slate-400', 'hover:text-white');
      listBtn?.classList.remove('bg-cyan-500', 'text-slate-950');
      listBtn?.classList.add('text-slate-400', 'hover:text-white');
    } else {
      listBtn?.classList.add('bg-cyan-500', 'text-slate-950');
      listBtn?.classList.remove('text-slate-400', 'hover:text-white');
      gridBtn?.classList.remove('bg-cyan-500', 'text-slate-950');
      gridBtn?.classList.add('text-slate-400', 'hover:text-white');
    }
    this.renderBooks();
  },

  getFilteredBooks() {
    let list = this.books;

    if (this.activeCategory === 'favorites') {
      list = list.filter(b => this.favorites.includes(b.id));
    } else if (this.activeCategory !== 'all') {
      list = list.filter(b => b.categoryKey === this.activeCategory);
    }

    if (this.formatFilter !== 'all') {
      list = list.filter(b => b.extension === this.formatFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q) ||
        b.fullTitle.toLowerCase().includes(q)
      );
    }

    return list;
  },

  renderBooks() {
    const container = document.getElementById('bibliotecaBooksContainer');
    if (!container) return;

    const filtered = this.getFilteredBooks();
    const countEl = document.getElementById('booksCountBadge');
    if (countEl) countEl.textContent = `${filtered.length} Obras`;

    const favBadge = document.getElementById('favCountBadge');
    if (favBadge) favBadge.textContent = this.favorites.length;

    if (filtered.length === 0) {
      container.className = 'w-full';
      container.innerHTML = `
        <div class="py-20 text-center text-slate-400 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600 text-2xl">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <h3 class="text-base font-bold text-slate-200">No se encontraron libros</h3>
          <p class="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o selecciona otra categoría.</p>
          <button onclick="BibliotecaEngine.filterCategory('all'); document.getElementById('bibliotecaSearchInput').value = '';" class="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold">
            Ver todas las 94 obras
          </button>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'grid') {
      container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';
      container.innerHTML = filtered.map(b => this.renderGridCard(b)).join('');
    } else {
      container.className = 'flex flex-col gap-3';
      container.innerHTML = filtered.map(b => this.renderListItem(b)).join('');
    }
  },

  renderGridCard(book) {
    const isFav = this.isFavorite(book.id);
    const isPdf = book.extension === 'PDF';

    return `
      <div class="group relative rounded-2xl bg-gradient-to-b ${book.gradient} border border-slate-800/80 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
        <div>
          <!-- Header de Tarjeta (Badge & Favorito) -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg ${book.badgeBg}">
              <i class="fa-solid ${book.categoryIcon}"></i> ${book.categoryName}
            </span>
            <button onclick="BibliotecaEngine.toggleFavorite('${book.id}')" class="text-sm p-1 transition-transform hover:scale-125 ${isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
              <i class="fa-solid fa-star"></i>
            </button>
          </div>

          <!-- Portada Táctica / Visual Preview -->
          <div class="my-4 h-28 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/40 transition-all">
            ${book.coverImage ? `
              <img src="${book.coverImage}" alt="${book.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0" onerror="this.remove()">
            ` : ''}
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none"></div>
            <i class="fa-solid ${book.categoryIcon} text-4xl text-slate-700 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500 z-0"></i>
            <span class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/90 text-slate-300 border border-slate-700 shadow z-20">
              ${book.extension}
            </span>
          </div>

          <!-- Título y Autor -->
          <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]" title="${book.fullTitle}">
            ${book.title}
          </h3>
          <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
            <i class="fa-solid fa-pen-nib text-slate-500 text-[10px]"></i> ${book.author}
          </p>

          <!-- Metadatos (Páginas y Tamaño) -->
          <div class="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span class="flex items-center gap-1"><i class="fa-regular fa-file-lines text-slate-500"></i> ${book.timeEstimate}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i class="fa-solid fa-hard-drive text-slate-500"></i> ${book.sizeFormatted}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
          ${isPdf ? `
            <button onclick="BibliotecaEngine.openReaderModal('${book.id}')" class="flex-1 py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i class="fa-solid fa-book-open text-xs"></i>
              <span>Leer Online</span>
            </button>
          ` : `
            <a href="${book.encodedPath}" download="${book.filename}" class="flex-1 py-2 px-3 rounded-xl bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i class="fa-solid fa-download text-sm"></i>
              <span>Descargar</span>
            </a>
          `}

          <a href="${book.encodedPath}" download="${book.filename}" class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-600 hover:border-cyan-500 hover:bg-slate-700 flex items-center justify-center text-slate-200 hover:text-cyan-300 transition-all shadow-sm" title="Descargar copia local (${book.sizeFormatted})">
            <i class="fa-solid fa-download text-sm"></i>
          </a>
        </div>
      </div>
    `;
  },

  renderListItem(book) {
    const isFav = this.isFavorite(book.id);
    const isPdf = book.extension === 'PDF';

    return `
      <div class="group rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 flex items-center justify-between gap-4 transition-all hover:bg-slate-800/40">
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
            <i class="fa-solid ${book.categoryIcon}"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-white group-hover:text-cyan-300 truncate" title="${book.fullTitle}">
                ${book.title}
              </h4>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                ${book.extension}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono">
              <span><i class="fa-solid fa-pen-nib text-slate-500 text-[10px]"></i> ${book.author}</span>
              <span>•</span>
              <span class="text-slate-500">${book.categoryName}</span>
              <span>•</span>
              <span class="text-slate-500">${book.sizeFormatted}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button onclick="BibliotecaEngine.toggleFavorite('${book.id}')" class="p-2 transition-transform hover:scale-125 ${isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}">
            <i class="fa-solid fa-star"></i>
          </button>

          ${isPdf ? `
            <button onclick="BibliotecaEngine.openReaderModal('${book.id}')" class="py-1.5 px-3 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-book-open"></i> Leer
            </button>
          ` : ''}

          <a href="${book.encodedPath}" download="${book.filename}" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Descargar">
            <i class="fa-solid fa-download"></i>
          </a>
        </div>
      </div>
    `;
  },

  // =============================================
  // VISOR MODAL DE LECTURA IN-APP
  // =============================================
  openReaderModal(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    this.currentReadingBook = book;

    const modal = document.getElementById('pdf-reader-modal');
    const titleEl = document.getElementById('pdfModalTitle');
    const catEl = document.getElementById('pdfModalCategory');
    const downloadBtn = document.getElementById('pdfModalDownloadBtn');
    const openNewTabBtn = document.getElementById('pdfModalNewTabBtn');
    const iframe = document.getElementById('pdfModalIframe');

    if (titleEl) titleEl.textContent = book.title;
    if (catEl) catEl.textContent = `${book.categoryName} • ${book.author}`;
    if (downloadBtn) {
      downloadBtn.href = book.encodedPath;
      downloadBtn.download = book.filename;
    }
    if (openNewTabBtn) {
      openNewTabBtn.href = book.encodedPath;
    }

    if (iframe) {
      // Inyectar el visor del navegador
      iframe.src = book.encodedPath;
    }

    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  },

  closeReaderModal() {
    const modal = document.getElementById('pdf-reader-modal');
    const iframe = document.getElementById('pdfModalIframe');
    if (iframe) {
      iframe.src = 'about:blank'; // Liberar memoria
    }
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  },

  toggleFullscreen() {
    const modal = document.getElementById('pdf-reader-modal-dialog');
    if (!modal) return;
    if (!document.fullscreenElement) {
      modal.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  }
};

if (typeof window !== 'undefined') {
  window.BibliotecaEngine = BibliotecaEngine;
}
if (typeof module !== 'undefined') {
  module.exports = BibliotecaEngine;
}
