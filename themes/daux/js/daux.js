/** global localStorage */
var _ = {};

_.now = Date.now || function() {
    return new Date().getTime();
};

_.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp;

    var later = function() {
        var last = _.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            func.apply(context, args);
            context = args = null;
        }

        return true;
    };
};



//Initialize CodeBlock Visibility Settings
$(function () {
    var codeBlockView = $('.Columns__right'),
        codeBlocks = $('.s-content pre'),
        toggleCodeSection = $('.CodeToggler'),
        toggleCodeBlockBtns = toggleCodeSection.find('.CodeToggler__button'),
        toggleCodeBlockBtn = toggleCodeSection.find('.CodeToggler__button--main'),
        toggleCodeBlockBtnHide = toggleCodeSection.find('.CodeToggler__button--hide'),
        toggleCodeBlockBtnBelow = toggleCodeSection.find('.CodeToggler__button--below'),
        toggleCodeBlockBtnFloat = toggleCodeSection.find('.CodeToggler__button--float');

    // If there is no code block we hide the link
    if (!codeBlocks.size()) {
        toggleCodeSection.addClass('hidden');
        return;
    }

    function setCodeBlockStyle(codeBlockState) {
        localStorage.setItem("codeBlockState", codeBlockState);

        toggleCodeBlockBtns.removeClass("Button--active");

        switch (codeBlockState) {
            case 2: // Show code blocks inline
                toggleCodeBlockBtnFloat.addClass("Button--active");
                codeBlockView.addClass('Columns__right--float');
                codeBlocks.removeClass('hidden');
                break;
            case 1: // Show code blocks below
                toggleCodeBlockBtnBelow.addClass("Button--active");
                toggleCodeBlockBtn.html("Hide Code Blocks");
                codeBlockView.removeClass('Columns__right--float');
                codeBlocks.removeClass('hidden');
                break;
            case 0: // Hidden code blocks
            default:
                toggleCodeBlockBtnHide.addClass("Button--active");
                toggleCodeBlockBtn.html("Show Code Blocks");
                codeBlockView.removeClass('Columns__right--float');
                codeBlocks.addClass('hidden');
                break;
        }
    }

    toggleCodeBlockBtn.click(function() {
        setCodeBlockStyle(codeBlocks.hasClass('hidden') ? 1 : 0);
    });

    toggleCodeBlockBtnHide.click(function() { setCodeBlockStyle(0); });
    toggleCodeBlockBtnBelow.click(function() { setCodeBlockStyle(1); });
    toggleCodeBlockBtnFloat.click(function() { setCodeBlockStyle(2); });

    var floating = $(document.body).hasClass("with-float");
    var codeBlockState = localStorage.getItem("codeBlockState");

    if (!codeBlockState) {
        codeBlockState = floating? 2 : 1;
    } else {
        codeBlockState = parseInt(codeBlockState);
    }

    if (!floating && codeBlockState == 2) {
        codeBlockState = 1;
    }

    setCodeBlockStyle(codeBlockState);
});


$(function () {
    // Tree navigation
    $('.aj-nav').click(function (e) {
        e.preventDefault();
        $(this).parent().siblings().find('ul').slideUp();
        $(this).next().slideToggle();
    });

    // New Tree navigation
    $('ul.Nav > li.has-children > a > .Nav__arrow').click(function() {
        $(this).parent().parent().toggleClass('Nav__item--open');
        return false;
    });

    // Responsive navigation
    $('.Collapsible__trigger').click(function () {
        $('.Collapsible__content').slideToggle();
    });

    //Github ribbon placement
    var ribbon = $('#github-ribbon');
    function onResize() {
        //Fix GitHub Ribbon overlapping Scrollbar
        var a = $('article');
        if (ribbon.length && a.length) {
            if (a[0] && a[0].scrollHeight > $('.right-column').height()) {
                ribbon[0].style.right = '16px';
            } else {
                ribbon[0].style.right = '';
            }
        }
    }
    $(window).resize(_.debounce(onResize, 100));
    onResize();
});

