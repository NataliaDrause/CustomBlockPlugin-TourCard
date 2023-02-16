<?php

/*
  Plugin Name: Tours Block Type for Bravada theme
  Version: 1.0
  Author: Natalia Drause
  Author URI: https://nataliadrause.com/
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require_once plugin_dir_path(__FILE__) . 'inc/generateTourHTML.php';

class NDToursBlock {
  function __construct() {
    add_action('init', [$this, 'onInit']);
  }

  function onInit() {
    wp_register_script('toursBlockScript', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-i18n', 'wp-editor', 'wp-element'));
    wp_register_style('toursBlockStyle', plugin_dir_url(__FILE__) . 'build/index.css');

    register_block_type('nd-plugin/nd-tours-block', array(
      'render_callback' => [$this, 'renderCallback'],
      'editor_script' => 'toursBlockScript',
      'editor_style' => 'toursBlockStyle'
    ));
  }

  function renderCallback($attributes) {

    if ($attributes['tourId']) {
      wp_enqueue_style('toursBlockStyle');
      return generateTourHTML($attributes);
    } else {
      return NULL;
    }

  }
}

$featuredProfessor = new NDToursBlock();