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
    //register API for displaying block preview on the backend
    add_action('rest_api_init', [$this, 'tourHTMLapi']);
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
      return generateTourHTML($attributes['tourId']);
    } else {
      return NULL;
    }

  }

  // Use API for displaying the preview on the backend
  function tourHTMLapi() {
    register_rest_route('ndtourblock/v1', 'getHTML', array(
      'methods' => WP_REST_SERVER::READABLE,
      'callback' => [$this, 'getTourHTMLapi'],
    ));
  }

  function getTourHTMLapi($data) {
    return generateTourHTML($data['tourId']);
  }

}

$featuredProfessor = new NDToursBlock();