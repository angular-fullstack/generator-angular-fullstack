<?php $this->layout('theme::layout/05_page') ?>
<article class="Page">
    <?php if ($params['html']['date_modified']) {
    ?>
        <div class="Page__header">
            <h1><?= $page['breadcrumbs'] ? $this->get_breadcrumb_title($page, $base_page) : $page['title'] ?></h1>
        </div>
    <?php

} else {
    ?>
        <div class="Page__header">
            <h1><?= $page['breadcrumbs'] ? $this->get_breadcrumb_title($page, $base_page) : $page['title'] ?></h1>
        </div>
    <?php

} ?>

    <div class="s-content">
        <?= $page['content']; ?>
    </div>

    <?php if (!empty($page['prev']) || !empty($page['next'])) {
    ?>
    <nav>
        <ul class="Pager">
            <?php if (!empty($page['prev'])) {
        ?><li class=Pager--prev><a href="<?= $base_url . $page['prev']->getUrl() ?>">Previous</a></li><?php

    } ?>
            <?php if (!empty($page['next'])) {
        ?><li class=Pager--next><a href="<?= $base_url . $page['next']->getUrl() ?>">Next</a></li><?php

    } ?>
        </ul>
    </nav>
    <?php

} ?>
</article>

