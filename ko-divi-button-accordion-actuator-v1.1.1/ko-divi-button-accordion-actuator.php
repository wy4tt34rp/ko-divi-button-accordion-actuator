<?php
/**
 * Plugin Name: KO – Divi Button Accordion Actuator
 * Description: Opens a specific Divi accordion toggle when a Divi Button module with actuator classes is clicked.
 * Version: 1.1.1
 * Author: Kevin ONeill
 * License: GPL2+
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'wp_enqueue_scripts', function() {
    if ( is_admin() ) {
        return;
    }

    wp_enqueue_script(
        'ko-divi-button-accordion-actuator',
        plugins_url( 'assets/ko-divi-button-accordion-actuator.js', __FILE__ ),
        array( 'jquery' ),
        '1.1.1',
        true
    );
} );
