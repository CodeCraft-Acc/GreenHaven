const testSlide = ()=>{
    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        grabCursor:true,
        loop:true
    });
}
testSlide()


const textAnim = () => {
    var typed = new Typed(".auto-type", {
        strings: ["BOGOR", "WISATA", "BUDAYA", "ALAM"],
        typeSpeed: 100,
        backSpeed: 120,
        loop: true
    })
}
textAnim()

const barAnim = () => {
    let bar = document.querySelector('.bar')
    let inrBar = document.querySelector('.inr-bar')
    let circle = document.querySelector('.circle')
    let dot = document.querySelector('.dot')
    let rating = document.querySelector('.rating')
    let inrBarTwo = document.querySelector('.inr-bar-two')

    bar.addEventListener('mouseenter', () => {
        bar.style.backgroundColor = "#fff"
        inrBar.style.backgroundColor = "#111"
        circle.style.backgroundColor = "#fff"
        dot.style.border = "2px solid #111"
        rating.style.color = "#fff"
        inrBarTwo.style.color = "#111"
    })
    bar.addEventListener('mouseleave', () => {
        bar.style.backgroundColor = "transparent"
        inrBar.style.backgroundColor = "#fff"
        circle.style.backgroundColor = "#111"
        dot.style.border = "2px solid #fff"
        rating.style.color = "#111"
        inrBarTwo.style.color = "#fff"
    })
}
barAnim()

function cursorAnim() {
    var cursor = document.querySelector("#cursor");
    var main = document.querySelector('main');

    function updateCursorPosition(e) {
        var posX = e.clientX + window.scrollX;
        var posY = e.clientY + window.scrollY;

        cursor.style.left = posX + 'px';
        cursor.style.top = posY + 'px';
    }

    main.addEventListener('mousemove', updateCursorPosition);

    window.addEventListener('scroll', updateCursorPosition);
}
cursorAnim();

const stickyHandAnimation = () => {
    const page5 = document.querySelector('.page5');
    const screensWrapper = document.querySelector('.screens-wrapper');
    const stickyHand = document.querySelector('.sticky-hand');
    const handContainer = document.querySelector('.hand-container');
    
    // Add transform property for better performance
    handContainer.style.willChange = 'transform';
    
    // Store calculated values
    let lastScrollY = window.scrollY;
    let ticking = false;
    let animationFrame;
    
    const updatePosition = () => {
        const page5Rect = page5.getBoundingClientRect();
        const screensRect = screensWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress more precisely
        const scrollStart = page5Rect.top + window.scrollY;
        const scrollEnd = scrollStart + screensRect.height - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, (window.scrollY - scrollStart) / (scrollEnd - scrollStart)));

        // Smoother easing function
        const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedProgress = ease(scrollProgress);

        if (page5Rect.top <= 0 && page5Rect.bottom > windowHeight) {
            // In view - apply sticky behavior with smooth parallax
            stickyHand.style.position = 'fixed';
            stickyHand.style.bottom = '0';
            stickyHand.style.transform = 'translateZ(0)'; // Hardware acceleration
            
            // Smoother movement with eased progress
            const moveY = easedProgress * 25; // Increased range for more noticeable effect
            handContainer.style.transform = `translate3d(0, ${moveY}px, 0)`;
            
        } else if (page5Rect.bottom <= windowHeight) {
            // Below view - lock to bottom
            stickyHand.style.position = 'absolute';
            stickyHand.style.bottom = '0';
            stickyHand.style.top = 'auto';
            handContainer.style.transform = 'translate3d(0, 25px, 0)';
            
        } else {
            // Above view - lock to top
            stickyHand.style.position = 'absolute';
            stickyHand.style.bottom = 'auto';
            stickyHand.style.top = '0';
            handContainer.style.transform = 'translate3d(0, 0, 0)';
        }

        ticking = false;
    };

    // Optimized scroll handler with debouncing
    const handleScroll = () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                updatePosition();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Optimized resize handler
    const handleResize = () => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(updatePosition);
    };

    // Add passive event listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial position
    updatePosition();

    // Cleanup function
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrame);
    };
};

// Initialize animation
const cleanup = stickyHandAnimation();

