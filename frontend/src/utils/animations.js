// Animation utility functions
export const animations = {
    // Easing functions
    easing: {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => 1 - (--t) * t * t * t,
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInBounce: (t) => 1 - animations.easing.easeOutBounce(1 - t),
        easeOutBounce: (t) => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        },
    },

    // Animation presets
    presets: {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
            duration: 300,
        },
        fadeOut: {
            from: { opacity: 1 },
            to: { opacity: 0 },
            duration: 300,
        },
        slideInUp: {
            from: { transform: 'translateY(20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
            duration: 400,
        },
        slideInDown: {
            from: { transform: 'translateY(-20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
            duration: 400,
        },
        slideInLeft: {
            from: { transform: 'translateX(-20px)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
            duration: 400,
        },
        slideInRight: {
            from: { transform: 'translateX(20px)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
            duration: 400,
        },
        scaleIn: {
            from: { transform: 'scale(0.9)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
            duration: 300,
        },
        bounce: {
            from: { transform: 'scale(1)' },
            to: { transform: 'scale(1.1)' },
            duration: 200,
            direction: 'alternate',
            iterations: 2,
        },
    },

    // Animate function
    animate: (element, animation, options = {}) => {
        if (!element) return Promise.resolve();

        const {
            duration = 300,
            easing = 'easeOutQuad',
            delay = 0,
            direction = 'normal',
            iterations = 1,
            fill = 'forwards',
        } = options;

        return new Promise((resolve) => {
            const keyframes = [];

            if (animation.from) {
                keyframes.push(animation.from);
            }

            if (animation.to) {
                keyframes.push(animation.to);
            }

            const animationOptions = {
                duration: animation.duration || duration,
                easing: animations.easingToCSSEasing(easing),
                delay,
                direction,
                iterations,
                fill,
            };

            const webAnimation = element.animate(keyframes, animationOptions);

            webAnimation.onfinish = () => resolve();
            webAnimation.oncancel = () => resolve();
        });
    },

    // Convert custom easing to CSS easing
    easingToCSSEasing: (easing) => {
        const cssEasings = {
            linear: 'linear',
            easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
            easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
            easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        };
        return cssEasings[easing] || 'ease';
    },

    // Stagger animations
    stagger: async (elements, animation, staggerDelay = 100, options = {}) => {
        const promises = [];

        elements.forEach((element, index) => {
            const elementOptions = {
                ...options,
                delay: (options.delay || 0) + (index * staggerDelay),
            };

            promises.push(animations.animate(element, animation, elementOptions));
        });

        return Promise.all(promises);
    },

    // Scroll-triggered animations
    onScroll: (element, animation, options = {}) => {
        const { threshold = 0.1, once = true } = options;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animations.animate(entry.target, animation, options);

                        if (once) {
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold }
        );

        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    },
};

// CSS-in-JS animation helpers
export const createAnimation = (name, keyframes) => {
    const keyframeString = Object.entries(keyframes)
        .map(([percentage, styles]) => {
            const styleString = Object.entries(styles)
                .map(([prop, value]) => `${prop}: ${value}`)
                .join('; ');
            return `${percentage} { ${styleString} }`;
        })
        .join(' ');

    return `@keyframes ${name} { ${keyframeString} }`;
};

// Generate spring animation
export const spring = (from, to, options = {}) => {
    const {
        tension = 120,
        friction = 14,
        mass = 1,
        velocity = 0,
    } = options;

    // Spring physics calculation
    const w0 = Math.sqrt(tension / mass);
    const zeta = friction / (2 * Math.sqrt(tension * mass));

    if (zeta < 1) {
        // Underdamped
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const A = 1;
        const B = (zeta * w0 + velocity) / wd;

        return (t) => {
            const envelope = Math.exp(-zeta * w0 * t);
            const oscillation = A * Math.cos(wd * t) + B * Math.sin(wd * t);
            return from + (to - from) * (1 - envelope * oscillation);
        };
    } else if (zeta === 1) {
        // Critically damped
        const r = -w0;
        const A = 1;
        const B = velocity + w0;

        return (t) => {
            const envelope = Math.exp(r * t);
            return from + (to - from) * (1 - envelope * (A + B * t));
        };
    } else {
        // Overdamped
        const r1 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
        const r2 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
        const A = (velocity - r2) / (r1 - r2);
        const B = 1 - A;

        return (t) => {
            return from + (to - from) * (1 - A * Math.exp(r1 * t) - B * Math.exp(r2 * t));
        };
    }
};