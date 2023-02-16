<?php

function generateTourHTML($attr) {
  $tourPost = new WP_Query(array(
    'post_type' => 'tour',
    'p' => $attr['tourId'],
  ));

  while($tourPost->have_posts()) {
    $tourPost->the_post();
    ob_start(); ?>

    <div class="nd-tour-block">
      <div class="nd-tour-block__photo" style="background-image: url(<?php the_post_thumbnail_url(); ?>)"></div>
      <div class="nd-tour-block__text">
        <h4><?php wp_strip_all_tags(the_title()); ?></h4>
        <?php 
          if((count($attr) > 1) && $attr['bulletList']) { ?>
            <ul>
              <?php
              foreach ($attr['bulletList'] as $bullet) {
                echo '<li>' . sanitize_text_field($bullet) . '</li>';
              } ?>
            </ul>
          <?php } elseif (get_the_excerpt()) {?>
            <p><?php echo sanitize_text_field(get_the_excerpt()); ?></p>
          <?php } else { ?>
            <p><?php echo wp_trim_words(get_the_content(), 30); ?></p>
        <?php } ?>
        <footer class="post-continue-container">
					<a class="continue-reading-link" href="<?php echo the_permalink(); ?>"><span>Read more</span><i class="icon-continue-reading"></i></a>
        </footer>
      </div>
    </div>

    <?php
    wp_reset_postdata();
    return ob_get_clean();
  }
}