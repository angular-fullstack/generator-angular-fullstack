/*
 Tipue Search 5.0
 Copyright (c) 2015 Tipue
 Tipue Search is released under the MIT License
 http://www.tipue.com/search
 */


(function ($) {

    // Stop words (list from http://www.ranks.nl/stopwords)
    var tipuesearch_stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];

    // Word replace
    var tipuesearch_replace = {'words': []};

    // Weighting
    var tipuesearch_weight = {'weight': []};

    // Stemming
    var tipuesearch_stem = {'words': []};

    // Internal strings
    var tipuesearch_string_results_for = 'Showing results for';
    var tipuesearch_string_search_instead = 'Search instead for';
    var tipuesearch_string_one_result = '1 result';
    var tipuesearch_string_results = 'results';
    var tipuesearch_string_prev = 'Previous';
    var tipuesearch_string_next = 'Next';
    var tipuesearch_string_no_results = 'Nothing found';
    var tipuesearch_string_common_words_ignored = 'Common words are largely ignored';
    var tipuesearch_string_too_short = 'Search too short';
    var tipuesearch_string_one_character_or_more = 'Should be one character or more';
    var tipuesearch_string_should_be_x_or_more = 'Should be !min characters or more';

    function getURLP(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    function closeContainer(e) {
        if (e.which == 27) { //escape
            $(document).off("keyup", closeContainer);

            tipue_container.hide();
            tipue_backdrop.hide();
        }
    }

    var tipue_container, tipue_backdrop;

    window.tipuesearch = function (options) {

        var set = $.extend(
            {
                'field': $('#tipue_search_input'),
                'show': 10,
                'showURL': true,
                'showTitleCount': true,
                'minimumLength': 3,
                'descriptiveWords': 25,
                'highlightTerms': true,
                'highlightEveryTerm': false,
                'liveDescription': '*',
                'liveContent': '*',
                'contentLocation': 'tipuesearch/tipuesearch_content.json',
                'debug': false
            }, options);


        var tipuesearch_in = {
            pages: []
        };

        var tipuesearch_t_c = 0;

        $.ajax(
            {
                dataType: "json",
                url: set.base_url + set.contentLocation,
                async: false
            })
            .done(
                function (json) {
                    tipuesearch_in = $.extend({}, json);
                });


        if (getURLP('q')) {
            set.field.val(getURLP('q'));
            getTipueSearch(0, true);
        }

        set.field.keyup(
            function (event) {
                if (event.keyCode == '13') {
                    getTipueSearch(0, true);
                }
            });


        function getTipueSearch(start, replace) {
            $('#tipue_search_content').hide();
            $('#tipue_search_content').html('<div class="tipue_search_spinner"><div class="tipue_search_rect1"></div><div class="tipue_search_rect2"></div><div class="rect3"></div></div>');
            $('#tipue_search_content').show();

            var out = '';
            var results = '';
            var show_replace = false;
            var show_stop = false;
            var standard = true;
            var c = 0;
            found = [];

            var d = set.field.val().toLowerCase();
            d = $.trim(d);

            if ((d.match("^\"") && d.match("\"$")) || (d.match("^'") && d.match("'$"))) {
                standard = false;
            }

            if (standard) {
                var d_w = d.split(' ');
                d = '';
                for (var i = 0; i < d_w.length; i++) {
                    var a_w = true;
                    for (var f = 0; f < tipuesearch_stop_words.length; f++) {
                        if (d_w[i] == tipuesearch_stop_words[f]) {
                            a_w = false;
                            show_stop = true;
                        }
                    }
                    if (a_w) {
                        d = d + ' ' + d_w[i];
                    }
                }
                d = $.trim(d);
                d_w = d.split(' ');
            } else {
                d = d.substring(1, d.length - 1);
            }

            if (d.length >= set.minimumLength) {
                if (standard) {
                    if (replace) {
                        var d_r = d;
                        for (var i = 0; i < d_w.length; i++) {
                            for (var f = 0; f < tipuesearch_replace.words.length; f++) {
                                if (d_w[i] == tipuesearch_replace.words[f].word) {
                                    d = d.replace(d_w[i], tipuesearch_replace.words[f].replace_with);
                                    show_replace = true;
                                }
                            }
                        }
                        d_w = d.split(' ');
                    }

                    var d_t = d;
                    for (var i = 0; i < d_w.length; i++) {
                        for (var f = 0; f < tipuesearch_stem.words.length; f++) {
                            if (d_w[i] == tipuesearch_stem.words[f].word) {
                                d_t = d_t + ' ' + tipuesearch_stem.words[f].stem;
                            }
                        }
                    }
                    d_w = d_t.split(' ');

                    for (var i = 0; i < tipuesearch_in.pages.length; i++) {
                        var score = 0;
                        var s_t = tipuesearch_in.pages[i].text;
                        for (var f = 0; f < d_w.length; f++) {
                            var pat = new RegExp(d_w[f], 'gi');
                            if (tipuesearch_in.pages[i].title.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].title.match(pat).length;
                                score += (20 * m_c);
                            }
                            if (tipuesearch_in.pages[i].text.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].text.match(pat).length;
                                score += (20 * m_c);
                            }

                            if (set.highlightTerms) {
                                if (set.highlightEveryTerm) {
                                    var patr = new RegExp('(' + d_w[f] + ')', 'gi');
                                } else {
                                    var patr = new RegExp('(' + d_w[f] + ')', 'i');
                                }
                                s_t = s_t.replace(patr, "<span class=\"h01\">$1</span>");
                            }

                            if (tipuesearch_in.pages[i].tags.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].tags.match(pat).length;
                                score += (10 * m_c);
                            }

                            if (tipuesearch_in.pages[i].url.search(pat) != -1) {
                                score += 20;
                            }

                            if (score != 0) {
                                for (var e = 0; e < tipuesearch_weight.weight.length; e++) {
                                    if (tipuesearch_in.pages[i].url == tipuesearch_weight.weight[e].url) {
                                        score += tipuesearch_weight.weight[e].score;
                                    }
                                }
                            }

                            if (d_w[f].match('^-')) {
                                pat = new RegExp(d_w[f].substring(1), 'i');
                                if (tipuesearch_in.pages[i].title.search(pat) != -1 || tipuesearch_in.pages[i].text.search(pat) != -1 || tipuesearch_in.pages[i].tags.search(pat) != -1) {
                                    score = 0;
                                }
                            }
                        }

                        if (score != 0) {
                            found.push(
                                {
                                    "score": score,
                                    "title": tipuesearch_in.pages[i].title,
                                    "desc": s_t,
                                    "url": tipuesearch_in.pages[i].url
                                });
                            c++;
                        }
                    }
                } else {
                    for (var i = 0; i < tipuesearch_in.pages.length; i++) {
                        var score = 0;
                        var s_t = tipuesearch_in.pages[i].text;
                        var pat = new RegExp(d, 'gi');
                        if (tipuesearch_in.pages[i].title.search(pat) != -1) {
                            var m_c = tipuesearch_in.pages[i].title.match(pat).length;
                            score += (20 * m_c);
                        }
                        if (tipuesearch_in.pages[i].text.search(pat) != -1) {
                            var m_c = tipuesearch_in.pages[i].text.match(pat).length;
                            score += (20 * m_c);
                        }

                        if (set.highlightTerms) {
                            if (set.highlightEveryTerm) {
                                var patr = new RegExp('(' + d + ')', 'gi');
                            } else {
                                var patr = new RegExp('(' + d + ')', 'i');
                            }
                            s_t = s_t.replace(patr, "<span class=\"h01\">$1</span>");
                        }

                        if (tipuesearch_in.pages[i].tags.search(pat) != -1) {
                            var m_c = tipuesearch_in.pages[i].tags.match(pat).length;
                            score += (10 * m_c);
                        }

                        if (tipuesearch_in.pages[i].url.search(pat) != -1) {
                            score += 20;
                        }

                        if (score != 0) {
                            for (var e = 0; e < tipuesearch_weight.weight.length; e++) {
                                if (tipuesearch_in.pages[i].url == tipuesearch_weight.weight[e].url) {
                                    score += tipuesearch_weight.weight[e].score;
                                }
                            }
                        }

                        if (score != 0) {
                            found.push(
                                {
                                    "score": score,
                                    "title": tipuesearch_in.pages[i].title,
                                    "desc": s_t,
                                    "url": tipuesearch_in.pages[i].url
                                });
                            c++;
                        }
                    }
                }

                if (c != 0) {
                    if (set.showTitleCount && tipuesearch_t_c == 0) {
                        var title = document.title;
                        document.title = '(' + c + ') ' + title;
                        tipuesearch_t_c++;
                    }

                    if (show_replace == 1) {
                        out += '<div id="tipue_search_warning">' + tipuesearch_string_results_for + ' ' + d + '. ' + tipuesearch_string_search_instead + ' <a id="tipue_search_replaced">' + d_r + '</a></div>';
                    }
                    if (c == 1) {
                        out += '<div id="tipue_search_results_count">' + tipuesearch_string_one_result + '</div>';
                    } else {
                        c_c = c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        out += '<div id="tipue_search_results_count">' + c_c + ' ' + tipuesearch_string_results + '</div>';
                    }

                    found.sort(
                        function (a, b) {
                            return b.score - a.score
                        });

                    var l_o = 0;
                    for (var i = 0; i < found.length; i++) {
                        if (l_o >= start && l_o < set.show + start) {
                            out += '<div class="tipue_search_content_title"><a href="' + set.base_url + found[i].url + '"' + '>' + found[i].title + '</a></div>';

                            if (set.debug) {
                                out += '<div class="tipue_search_content_debug">Score: ' + found[i].score + '</div>';
                            }

                            if (set.showURL) {
                                var s_u = found[i].url.toLowerCase();
                                if (s_u.indexOf('http://') == 0) {
                                    s_u = s_u.slice(7);
                                }
                                out += '<div class="tipue_search_content_url"><a href="' + set.base_url + found[i].url + '"' + '>' + s_u + '</a></div>';
                            }

                            if (found[i].desc) {
                                var t = found[i].desc;
                                var t_d = '';
                                var t_w = t.split(' ');
                                if (t_w.length < set.descriptiveWords) {
                                    t_d = t;
                                } else {
                                    for (var f = 0; f < set.descriptiveWords; f++) {
                                        t_d += t_w[f] + ' ';
                                    }
                                }
                                t_d = $.trim(t_d);
                                if (t_d.charAt(t_d.length - 1) != '.') {
                                    t_d += ' ...';
                                }
                                out += '<div class="tipue_search_content_text">' + t_d + '</div>';
                            }
                        }
                        l_o++;
                    }

                    if (c > set.show) {
                        var pages = Math.ceil(c / set.show);
                        var page = (start / set.show);
                        out += '<div id="tipue_search_foot"><ul id="tipue_search_foot_boxes" class="Pager">';

                        if (start > 0) {
                            out += '<li class="Pager--prev"><a class="tipue_search_foot_box" id="' + (start - set.show) + '_' + replace + '">' + tipuesearch_string_prev + '</a></li>';
                        }

                        if (page <= 2) {
                            var p_b = pages;
                            if (pages > 3) {
                                p_b = 3;
                            }
                            for (var f = 0; f < p_b; f++) {
                                if (f == page) {
                                    out += '<li class="current">' + (f + 1) + '</li>';
                                } else {
                                    out += '<li><a class="tipue_search_foot_box" id="' + (f * set.show) + '_' + replace + '">' + (f + 1) + '</a></li>';
                                }
                            }
                        } else {
                            var p_b = page + 2;
                            if (p_b > pages) {
                                p_b = pages;
                            }
                            for (var f = page - 1; f < p_b; f++) {
                                if (f == page) {
                                    out += '<li class="current">' + (f + 1) + '</li>';
                                } else {
                                    out += '<li><a class="tipue_search_foot_box" id="' + (f * set.show) + '_' + replace + '">' + (f + 1) + '</a></li>';
                                }
                            }
                        }

                        if (page + 1 != pages) {
                            out += '<li class="Pager--next"><a class="tipue_search_foot_box " id="' + (start + set.show) + '_' + replace + '">' + tipuesearch_string_next + '</a></li>';
                        }

                        out += '</ul></div>';
                    }
                } else {
                    out += '<div id="tipue_search_warning">' + tipuesearch_string_no_results + '</div>';
                }
            } else {
                if (show_stop) {
                    out += '<div id="tipue_search_warning">' + tipuesearch_string_no_results + '. ' + tipuesearch_string_common_words_ignored + '</div>';
                } else {
                    out += '<div id="tipue_search_warning">' + tipuesearch_string_too_short + '</div>';
                    if (set.minimumLength == 1) {
                        out += '<div id="tipue_search_warning">' + tipuesearch_string_one_character_or_more + '</div>';
                    } else {
                        out += '<div id="tipue_search_warning">' + tipuesearch_string_should_be_x_or_more.replace("!min", set.minimumLength) + '</div>';
                    }
                }
            }

            if (!tipue_container) {
                tipue_container = $(document.createElement("div"));
                tipue_container.attr('id', "tipue_search_content");
                document.body.appendChild(tipue_container.get(0));

                tipue_backdrop = $(document.createElement("div"));
                tipue_backdrop.attr('id', "tipue_search_backdrop");
                document.body.appendChild(tipue_backdrop.get(0));
            }

            tipue_backdrop.show();
            tipue_container.scrollTop(0);
            tipue_container.show().html(out);

            $('#tipue_search_replaced').click(
                function () {
                    getTipueSearch(0, false);
                });

            $('.tipue_search_foot_box').click(
                function () {
                    var id_v = $(this).attr('id');
                    var id_a = id_v.split('_');

                    getTipueSearch(parseInt(id_a[0]), id_a[1]);

                    tipue_container.scrollTop(0);
                });

            $(document).keyup(closeContainer);
        }

    };

})(jQuery);
