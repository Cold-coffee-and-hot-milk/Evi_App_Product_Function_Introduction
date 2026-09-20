// 图片懒加载 - 优化版
(function() {
    'use strict';

    let imageObserver = null;
    const loadedImages = new WeakSet();
    const observingImages = new WeakSet();

    function setupImageObserver() {
        if (imageObserver) return imageObserver;

        if ('IntersectionObserver' in window) {
            imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        loadImage(entry.target);
                        observer.unobserve(entry.target);
                        observingImages.delete(entry.target);
                    }
                });
            }, {
                rootMargin: '200px 0px', // 提前200px开始加载，让用户滚动时图片已就绪
                threshold: 0.01
            });
        }
        return imageObserver;
    }

    function observeNewImages(root) {
        var scope = root || document;
        var images = scope.querySelectorAll('img[data-src]:not(.lazy-loaded)');

        if (!imageObserver) setupImageObserver();

        images.forEach(function(img) {
            if (observingImages.has(img) || loadedImages.has(img)) return;

            if (imageObserver) {
                imageObserver.observe(img);
                observingImages.add(img);
            } else {
                // 不支持 IntersectionObserver，直接加载所有
                loadImage(img);
            }
        });
    }

    function loadImage(img) {
        if (loadedImages.has(img)) return;

        var dataSrc = img.getAttribute('data-src');
        if (!dataSrc) return;

        // 标记为正在加载，避免重复触发
        img.classList.add('lazy-loading');

        var tempImg = new Image();

        tempImg.onload = function() {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.remove('lazy', 'lazy-loading');
            img.classList.add('lazy-loaded');
            loadedImages.add(img);
        };

        tempImg.onerror = function() {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
            // 尝试加载原始 PNG 作为 fallback
            var pngSrc = dataSrc.replace(/\.webp$/i, '.png');
            if (pngSrc !== dataSrc) {
                img.setAttribute('data-src', pngSrc);
                // 不自动重试，等待用户滚动到
            }
        };

        tempImg.src = dataSrc;
    }

    function preloadVisibleImages() {
        var visibleImages = document.querySelectorAll('img[data-src]:not(.lazy-loaded)');
        var windowHeight = window.innerHeight;

        visibleImages.forEach(function(img) {
            var rect = img.getBoundingClientRect();
            if (rect.top < windowHeight + 300 && rect.bottom > -300) {
                if (!loadedImages.has(img)) {
                    loadImage(img);
                }
            }
        });
    }

    // 防抖
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        setupImageObserver();
        observeNewImages();

        setTimeout(function() {
            preloadVisibleImages();
        }, 100);

        // 滚动时检查
        window.addEventListener('scroll', debounce(function() {
            preloadVisibleImages();
        }, 150), { passive: true });

        // resize 时检查
        window.addEventListener('resize', debounce(function() {
            preloadVisibleImages();
        }, 200), { passive: true });
    });

    // 暴露到全局（供 main.js 在页面切换后调用）
    window.setupImageLazyLoad = function(root) {
        observeNewImages(root);
    };
    window.preloadVisibleImages = preloadVisibleImages;
})();
