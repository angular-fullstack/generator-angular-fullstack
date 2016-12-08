<a class="Navbar__brand" href="<?= $params['base_page'] . $params['index']->getUri(); ?>"><?= $params['title']; ?></a>

<?php if ($params['html']['search']) {
    ?>
    <div class="Search">
        <svg class="Search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451 451"><path d="M447.05 428l-109.6-109.6c29.4-33.8 47.2-77.9 47.2-126.1C384.65 86.2 298.35 0 192.35 0 86.25 0 .05 86.3.05 192.3s86.3 192.3 192.3 192.3c48.2 0 92.3-17.8 126.1-47.2L428.05 447c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.2-5.2 5.2-13.8 0-19zM26.95 192.3c0-91.2 74.2-165.3 165.3-165.3 91.2 0 165.3 74.2 165.3 165.3s-74.1 165.4-165.3 165.4c-91.1 0-165.3-74.2-165.3-165.4z"/></svg>
        <input type="search" id="tipue_search_input" class="Search__field" placeholder="Search..." autocomplete="on" results=25 autosave=text_search>
    </div>
<?php

} ?>
