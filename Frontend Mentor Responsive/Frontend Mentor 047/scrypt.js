let extensions = [
    {
        "logo": "images/logo-devlens.svg",
        "name": "DevLens",
        "description": "Quickly inspect page layouts and visualize element boundaries.",
        "isActive": true
    },
    {
        "logo": "images/logo-style-spy.svg",
        "name": "StyleSpy",
        "description": "Instantly analyze and copy CSS from any webpage element.",
        "isActive": true
    },
    {
        "logo": "images/logo-speed-boost.svg",
        "name": "SpeedBoost",
        "description": "Optimizes browser resource usage to accelerate page loading.",
        "isActive": false
    },
    {
        "logo": "images/logo-json-wizard.svg",
        "name": "JSONWizard",
        "description": "Formats, validates, and prettifies JSON responses in-browser.",
        "isActive": true
    },
    {
        "logo": "images/logo-tab-master-pro.svg",
        "name": "TabMaster Pro",
        "description": "Organizes browser tabs into groups and sessions.",
        "isActive": true
    },
    {
        "logo": "images/logo-viewport-buddy.svg",
        "name": "ViewportBuddy",
        "description": "Simulates various screen resolutions directly within the browser.",
        "isActive": false
    },
    {
        "logo": "images/logo-markup-notes.svg",
        "name": "Markup Notes",
        "description": "Enables annotation and notes directly onto webpages for collaborative debugging.",
        "isActive": true
    },
    {
        "logo": "images/logo-grid-guides.svg",
        "name": "GridGuides",
        "description": "Overlay customizable grids and alignment guides on any webpage.",
        "isActive": false
    },
    {
        "logo": "images/logo-palette-picker.svg",
        "name": "Palette Picker",
        "description": "Instantly extracts color palettes from any webpage.",
        "isActive": true
    },
    {
        "logo": "images/logo-link-checker.svg",
        "name": "LinkChecker",
        "description": "Scans and highlights broken links on any page.",
        "isActive": true
    },
    {
        "logo": "images/logo-dom-snapshot.svg",
        "name": "DOM Snapshot",
        "description": "Capture and export DOM structures quickly.",
        "isActive": false
    },
    {
        "logo": "images/logo-console-plus.svg",
        "name": "ConsolePlus",
        "description": "Enhanced developer console with advanced filtering and logging.",
        "isActive": true
    }
]
const HTML = document.querySelector('HTML');
const extensionContainer = document.querySelector('.extension-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleImg = themeToggle.lastElementChild;
let extensionItems
let isDark = false
let selectedFilter = 'all'

function setTheme() {
    switch(isDark) {
        case false: 
            themeToggleImg.src = 'assets/images/icon-sun.svg'
            isDark = !isDark
            HTML.classList.toggle('darkmode')
            break
        case true:
            themeToggleImg.src = 'assets/images/icon-moon.svg'
            isDark = !isDark
            HTML.classList.toggle('darkmode')
            break
}}



themeToggle.addEventListener('click', setTheme)



function updateExtensionContainerHTML(extensions) {
    extensionContainer.innerHTML = ''
    extensions.forEach(({logo, name, description, isActive}) => {
        extensionContainer.innerHTML += isActive 
            ?    `<div class="extension-item">
                    <div class="extension-info">
                        <img src="${logo}" alt="">
                        <div class="extension-info-text">
                            <h1>${name}</h1>
                            <p>${description}</p>
                        </div>
                    </div>
                    <div class="extension-btn-container">
                        <button class="remove-btn">Remove</button>
                        <button class="activate-toggle active">
                            <div class="circle"></div>
                        </button>
                    </div>
                </div>`
            :    `<div class="extension-item">
                    <div class="extension-info">
                        <img src="${logo}" alt="">
                        <div class="extension-info-text">
                            <h1>${name}</h1>
                            <p>${description}</p>
                        </div>
                    </div>
                    <div class="extension-btn-container">
                        <button class="remove-btn">Remove</button>
                        <button class="activate-toggle">
                            <div class="circle"></div>
                        </button>
                    </div>
                </div>`
            
    })
    setDeleteButtonEventListener(extensions)
    setToggleEventListener(extensions)
    extensionItems = document.querySelectorAll('.extension-item')
    filterExtensions()
}






function setToggleEventListener(extensions) {
    const activateToggles = document.querySelectorAll('.activate-toggle');
    activateToggles.forEach(((toggle, index) => toggle.addEventListener('click', () => {
        toggle.classList.toggle('active')
        extensions[index].isActive = !extensions[index].isActive
    })))
}

function setDeleteButtonEventListener(extensions) {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(((button, index) => button.addEventListener('click', () => {
        console.log(extensions[index])
        extensions.splice(index, 1)
        updateExtensionContainerHTML(extensions)
    })))
    
}


updateExtensionContainerHTML(extensions)


function setFilter(e) {
    filterButtons.forEach(filterButton => filterButton.classList.remove('highlight'))
    e.target.classList.add('highlight')
    selectedFilter = e.target.value
}

function filterExtensions() {
    
    extensionItems.forEach(extensionItem => {
        switch(selectedFilter) {
            case 'all':
                extensionItem.style.display = 'flex'
                break
            case 'active':
                if(extensionItem.lastElementChild.lastElementChild.classList.contains('active')) {
                    extensionItem.style.display = 'flex'
                }
                else {
                    extensionItem.style.display = 'none'
                }
                break
            case 'inactive':
                if(extensionItem.lastElementChild.lastElementChild.classList.contains('active')) {
                    extensionItem.style.display = 'none'
                }
                else {
                    extensionItem.style.display = 'flex'
                }
                break

    }
    });

}




filterButtons.forEach(filterButton => {
    filterButton.addEventListener('click', setFilter)
    filterButton.addEventListener('click', filterExtensions)
})
