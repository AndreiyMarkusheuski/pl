// Common presentation functionality
class Presentation {
    constructor(imageUrls) {
        this.imageUrls = imageUrls;
        this.currentIndex = 0;
        
        this.currentImg = document.querySelector('.current-image');
        this.counter = document.getElementById('counter');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.closeBtn = document.getElementById('closeBtn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showKeyboardHelp();
        this.showImage(0);
    }
    
    showImage(index) {
        if (index >= 0 && index < this.imageUrls.length) {
            this.currentIndex = index;
            this.currentImg.classList.add('loading');
            
            const img = new Image();
            img.onload = () => {
                this.currentImg.src = this.imageUrls[index];
                this.currentImg.classList.remove('loading');
                this.preloadImages();
            };
            img.onerror = () => {
                this.currentImg.classList.remove('loading');
                console.error('Failed to load image:', this.imageUrls[index]);
            };
            img.src = this.imageUrls[index];
            
            this.counter.textContent = `${index + 1} / ${this.imageUrls.length}`;
        }
    }
    
    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.imageUrls.length;
        this.showImage(nextIndex);
    }
    
    prevImage() {
        const prevIndex = this.currentIndex === 0 ? this.imageUrls.length - 1 : this.currentIndex - 1;
        this.showImage(prevIndex);
    }
    
    closePresentation() {
        // Navigate back to main page
        window.location.href = '../index.html';
    }
    
    preloadImages() {
        const preloadContainer = document.createElement('div');
        preloadContainer.className = 'image-preload';
        document.body.appendChild(preloadContainer);
        
        for (let i = -3; i <= 3; i++) {
            if (i === 0) continue;
            const index = (this.currentIndex + i + this.imageUrls.length) % this.imageUrls.length;
            const img = document.createElement('img');
            img.src = this.imageUrls[index];
            img.style.display = 'none';
            preloadContainer.appendChild(img);
        }
    }
    
    showKeyboardHelp() {
        const help = document.createElement('div');
        help.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 1000;
            display: none;
        `;
        help.innerHTML = `
            <strong>Sterowanie:</strong><br>
            ← → lub Spacja - nawigacja<br>
            Esc - zamknij<br>
            H - pokaż/ukryj pomoc
        `;
        help.id = 'keyboard-help';
        document.body.appendChild(help);
    }
    
    setupEventListeners() {
        // Button events
        this.nextBtn.onclick = (e) => { e.stopPropagation(); this.nextImage(); };
        this.prevBtn.onclick = (e) => { e.stopPropagation(); this.prevImage(); };
        this.closeBtn.onclick = (e) => { e.stopPropagation(); this.closePresentation(); };
        this.currentImg.onclick = () => this.nextImage();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextImage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImage();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closePresentation();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    const help = document.getElementById('keyboard-help');
                    if (help) {
                        help.style.display = help.style.display === 'none' ? 'block' : 'none';
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.showImage(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.showImage(this.imageUrls.length - 1);
                    break;
            }
        });
    }
}
