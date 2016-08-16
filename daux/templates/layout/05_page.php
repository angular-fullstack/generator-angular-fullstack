<?php $this->layout('theme::layout/00_layout') ?>

<?php if ($params['html']['repo']) {
    ?>
    <a href="https://github.com/<?= $params['html']['repo']; ?>" target="_blank" id="github-ribbon" class="Github hidden-print"><img src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
<?php

} ?>

<div class="Navbar hidden-print">
    <?php $this->insert('theme::partials/navbar_content', ['params' => $params]); ?>
</div>
<div class="Columns content">
    <div class="Columns__left hidden-print Collapsible">
        <div class="Collapsible__container">
            <button type="button" class="Button Collapsible__trigger">
                <span class="Collapsible__trigger--bar"></span>
                <span class="Collapsible__trigger--bar"></span>
                <span class="Collapsible__trigger--bar"></span>
            </button>
        </div>

        <div class="Collapsible__content">
            <!-- Navigation -->
            <?php
            $rendertree = $tree;
            $path = '';

            if ($page['language'] !== '') {
                $rendertree = $tree->value[$page['language']];
                $path = $page['language'];
            }

            echo $this->get_navigation($rendertree, $path, isset($params['request']) ? $params['request'] : '', $base_page, $params['mode']);
            ?>


            <div class="Links">
                <?php if (!empty($params['html']['links'])) {
                ?>
                    <hr/>
                    <?php foreach ($params['html']['links'] as $name => $url) {
                    ?>
                        <a href="<?= $url ?>" target="_blank"><?= $name ?></a>
                        <br />
                    <?php

                } ?>
                <?php

            } ?>

                <?php if ($params['html']['toggle_code']) {
                ?>
                    <div class="CodeToggler">
                        <hr/>
                        <?php if ($params['html']['float']) {
                    ?>
                            <span class="CodeToggler__text">Code blocks</span>
                            <div class="ButtonGroup" role="group">
                                <button class="Button Button--default Button--small CodeToggler__button CodeToggler__button--hide">No</button>
                                <button class="Button Button--default Button--small CodeToggler__button CodeToggler__button--below">Below</button>
                                <button class="Button Button--default Button--small CodeToggler__button CodeToggler__button--float">Inline</button>
                            </div>
                        <?php

                } else {
                    ?>
                            <a class="CodeToggler__button CodeToggler__button--main" href="#">Show Code Blocks Inline</a><br>
                        <?php

                } ?>
                    </div>
                <?php

            } ?>

                <?php if (!empty($params['html']['twitter'])) {
                ?>
                    <hr/>
                    <div class="Twitter">
                        <?php foreach ($params['html']['twitter'] as $handle) {
                    ?>
                            <iframe allowtransparency="true" frameborder="0" scrolling="no" style="width:162px; height:20px;" src="https://platform.twitter.com/widgets/follow_button.html?screen_name=<?= $handle; ?>&amp;show_count=false"></iframe>
                            <br />
                            <br />
                        <?php

                } ?>
                    </div>
                <?php

            } ?>
            </div>
        </div>
        <!-- For Mobile -->


    </div>
    <div class="Columns__right <?= $params['html']['float'] ? 'Columns__right--float' : ''; ?>">

        <div class="Columns__right__content">
            <div class="doc_content">
                <?= $this->section('content'); ?>
            </div>
        </div>
    </div>
</div>
