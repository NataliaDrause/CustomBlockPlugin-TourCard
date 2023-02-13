<?php

function generateTourHTML($id) {
  $tourPost = new WP_Query(array(
    'post_type' => 'tour',
    'p' => $id,
  ));

  while($tourPost->have_posts()) {
    $tourPost->the_post();
    ob_start(); ?>

    <div class="nd-tour-block">
      <div class="nd-tour-block__photo" style="background-image: url(<?php the_post_thumbnail_url(); ?>)"></div>
      <div class="nd-tour-block__text">
        <h4><?php wp_strip_all_tags(get_the_title()); ?></h4>
        <p><?php echo wp_trim_words(get_the_content(), 30); ?></p>
        <footer class="post-continue-container">
					<a class="continue-reading-link" href="<?php the_permalink(); ?>"><span>Read more</span><i class="icon-continue-reading"></i></a>
        </footer>
      </div>
    </div>

    <?php
    wp_reset_postdata();
    return ob_get_clean();
  }
}