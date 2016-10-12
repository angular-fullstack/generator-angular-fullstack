<?php $this->layout('theme::layout/00_layout') ?>
<div class="Navbar hidden-print">
    <div class="container">
        <?php $this->insert('theme::partials/navbar_content', ['params' => $params]); ?>
    </div>
</div>

<?php if ($params['html']['repo']) {
    ?>
    <a href="https://github.com/<?= $params['html']['repo']; ?>" target="_blank" id="github-ribbon" class="Github hidden-print"><img src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
<?php

} ?>

<div class="Homepage">
    <div class="HomepageTitle container">
        <?php if ($params['tagline']) {
    echo '<h2>' . $params['tagline'] . '</h2>';
} ?>
    </div>

    <div class="HomepageImage container">
        <?php if ($params['image']) {
    echo '<img class="homepage-image img-responsive" src="' . $params['image'] . '" alt="' . $params['title'] . '">';
} ?>
    </div>

    <div class="HomepageButtons">
        <div class="container">
            <?php
            if ($params['html']['repo']) {
                echo '<a href="https://github.com/' . $params['html']['repo'] . '" class="Button Button--secondary Button--hero">View On GitHub</a>';
            }
            foreach ($page['entry_page'] as $key => $node) {
                echo '<a href="' . $node . '" class="Button Button--primary Button--hero">' . $key . '</a>';
            }
            ?>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="HomepageContent">
    <div class="container">
        <div class="container--inner">
            <div class="doc_content s-content">
                <?= $page['content']; ?>
            </div>
        </div>
    </div>
</div>

<div class="HomepageFooter">
    <div class="container">
        <div class="container--inner">
            <?php if (!empty($params['html']['links'])) {
                ?>
                <ul class="HomepageFooter__links">
                    <?php foreach ($params['html']['links'] as $name => $url) {
                    echo '<li><a href="' . $url . '" target="_blank">' . $name . '</a></li>';
                } ?>
                </ul>
            <?php

            } ?>

            <?php if (!empty($params['html']['twitter'])) {
                ?>
                <div class="HomepageFooter__twitter">
                    <?php foreach ($params['html']['twitter'] as $handle) {
                    ?>
                    <div class="Twitter">
                        <iframe allowtransparency="true" frameborder="0" scrolling="no" style="width:162px; height:20px;" src="https://platform.twitter.com/widgets/follow_button.html?screen_name=<?= $handle; ?>&amp;show_count=false"></iframe>
                    </div>
                    <?php

                } ?>
                </div>
            <?php

            } ?>
        </div>
    </div>
    <div class="clearfix"></div>
</div>
