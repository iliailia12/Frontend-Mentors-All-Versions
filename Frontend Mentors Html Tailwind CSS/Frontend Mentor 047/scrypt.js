    const HTML = document.documentElement;
    const extensionContainer = document.querySelector('.extension-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    let selectedFilter = 'all';
    let isDark = false;

    let extensions = [
      {
        logo: "images/logo-devlens.svg",
        name: "DevLens",
        description: "Quickly inspect page layouts and visualize element boundaries.",
        isActive: true
      },
      {
        logo: "images/logo-style-spy.svg",
        name: "StyleSpy",
        description: "Instantly analyze and copy CSS from any webpage element.",
        isActive: true
      },
      {
        logo: "images/logo-speed-boost.svg",
        name: "SpeedBoost",
        description: "Optimizes browser resource usage to accelerate page loading.",
        isActive: false
      },
      {
        logo: "images/logo-json-wizard.svg",
        name: "JSONWizard",
        description: "Formats, validates, and prettifies JSON responses in-browser.",
        isActive: true
      },
      {
        logo: "images/logo-tab-master-pro.svg",
        name: "TabMaster Pro",
        description: "Organizes browser tabs into groups and sessions.",
        isActive: true
      },
      {
        logo: "images/logo-viewport-buddy.svg",
        name: "ViewportBuddy",
        description: "Simulates various screen resolutions directly within the browser.",
        isActive: false
      },
      {
        logo: "images/logo-markup-notes.svg",
        name: "Markup Notes",
        description: "Enables annotation and notes directly onto webpages for collaborative debugging.",
        isActive: true
      },
      {
        logo: "images/logo-grid-guides.svg",
        name: "GridGuides",
        description: "Overlay customizable grids and alignment guides on any webpage.",
        isActive: false
      },
      {
        logo: "images/logo-palette-picker.svg",
        name: "Palette Picker",
        description: "Instantly extracts color palettes from any webpage.",
        isActive: true
      },
      {
        logo: "images/logo-link-checker.svg",
        name: "LinkChecker",
        description: "Scans and highlights broken links on any page.",
        isActive: true
      },
      {
        logo: "images/logo-dom-snapshot.svg",
        name: "DOM Snapshot",
        description: "Capture and export DOM structures quickly.",
        isActive: false
      },
      {
        logo: "images/logo-console-plus.svg",
        name: "ConsolePlus",
        description: "Enhanced developer console with advanced filtering and logging.",
        isActive: true
      }
    ];

    function setTheme() {
      isDark = !isDark;
      HTML.classList.toggle('dark');
      themeIcon.src = isDark ? 'assets/images/icon-sun.svg' : 'assets/images/icon-moon.svg';
    }

    themeToggle.addEventListener('click', setTheme);

    function renderExtensions(list) {
      extensionContainer.innerHTML = '';
      list.forEach((ext, index) => {
        const activeClass = ext.isActive ? 'bg-red-400 justify-end' : 'bg-neutral-300 justify-start';
        const toggleBtn = `
          <button class="activate-toggle w-12 h-6 rounded-full flex items-center ${activeClass} transition-colors" data-index="${index}">
            <div class="circle w-6 h-6 bg-white rounded-full shadow-md transform transition-all"></div>
          </button>
        `;

        extensionContainer.innerHTML += `
          <div class="extension-item flex flex-col bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-300 gap-4 min-h-[14rem]">
            <div class="flex gap-4 items-start">
              <img src="${ext.logo}" class="w-12 mt-1" alt="${ext.name}" />
              <div>
                <h2 class="text-lg font-semibold">${ext.name}</h2>
                <p class="text-sm text-neutral-700 dark:text-neutral-300">${ext.description}</p>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <button class="remove-btn border border-neutral-300 rounded-full px-4 py-1 hover:border-red-700" data-index="${index}">Remove</button>
              ${toggleBtn}
            </div>
          </div>
        `;
      });

      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = parseInt(e.target.dataset.index);
          extensions.splice(idx, 1);
          renderExtensions(extensions);
          applyFilter();
        });
      });

      document.querySelectorAll('.activate-toggle').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = parseInt(e.currentTarget.dataset.index);
          extensions[idx].isActive = !extensions[idx].isActive;
          renderExtensions(extensions);
          applyFilter();
        });
      });
    }

    function applyFilter() {
      const items = document.querySelectorAll('.extension-item');
      items.forEach((item, i) => {
        const isActive = extensions[i].isActive;
        item.style.display = (
          selectedFilter === 'all' ||
          (selectedFilter === 'active' && isActive) ||
          (selectedFilter === 'inactive' && !isActive)
        ) ? 'flex' : 'none';
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        filterButtons.forEach(b => b.classList.remove('highlight', 'bg-red-500', 'text-white'));
        e.target.classList.add('highlight', 'bg-red-500', 'text-white');
        selectedFilter = e.target.value;
        applyFilter();
      });
    });
    renderExtensions(extensions);
    applyFilter();