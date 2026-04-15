(function ($) {
  "use strict";

  var OFFSET = 120;
  var SPEED = 200;

  function getTargetIdFromClasses(el) {
    if (!el || !el.classList) return "";
    for (var i = 0; i < el.classList.length; i++) {
      var cls = el.classList[i];
      if (cls.indexOf("ko-target-") === 0 && cls.length > 10) {
        return cls.substring(10);
      }
    }
    return "";
  }

  function findActuatorModule(start) {
    if (!start || !start.closest) return null;

    var direct = start.closest('.ko-accordion-actuator');
    if (direct) return direct;

    return start.closest('.et_pb_button_module_wrapper, .et_pb_button_module, .et_pb_promo_button');
  }

  function findTargetToggle(targetId) {
    if (!targetId) return $();
    var $marker = $('#' + targetId);
    if (!$marker.length) return $();
    return $marker.first().closest('.et_pb_toggle');
  }

  function closeOthers($toggle) {
    var $accordion = $toggle.closest('.et_pb_accordion');
    var $scope = $accordion.length ? $accordion : $(document);

    $scope.find('.et_pb_toggle.et_pb_toggle_open').not($toggle).each(function () {
      var $open = $(this);
      $open.removeClass('et_pb_toggle_open').addClass('et_pb_toggle_close');
      $open.children('.et_pb_toggle_content').stop(true, true).slideUp(SPEED, 'linear');
    });
  }

  function openToggle($toggle) {
    if (!$toggle.length) return false;

    closeOthers($toggle);

    var $content = $toggle.children('.et_pb_toggle_content');

    if (!$toggle.hasClass('et_pb_toggle_open')) {
      $toggle.removeClass('et_pb_toggle_close').addClass('et_pb_toggle_open');
      $content.stop(true, true).slideDown(SPEED, 'linear');
    }

    window.setTimeout(function () {
      var top = $toggle.offset().top - OFFSET;
      if (top < 0) top = 0;
      $('html, body').stop(true).animate({ scrollTop: top }, 350);
    }, 30);

    return true;
  }

  function activateFromElement(clickedEl) {
    var module = findActuatorModule(clickedEl);
    if (!module) return false;

    if (!module.classList.contains('ko-accordion-actuator')) {
      var parentActuator = clickedEl.closest ? clickedEl.closest('.ko-accordion-actuator') : null;
      if (!parentActuator) return false;
      module = parentActuator;
    }

    var targetId = getTargetIdFromClasses(module);
    if (!targetId) return false;

    var $toggle = findTargetToggle(targetId);
    if (!$toggle.length) return false;

    return openToggle($toggle);
  }

  function neutralizeLinks() {
    $('.ko-accordion-actuator').each(function () {
      var $module = $(this);
      var $links = $module.is('a, button') ? $module : $module.find('a.et_pb_button, a, button');

      $links.each(function () {
        var $el = $(this);
        if ($el.is('a')) {
          $el.attr('href', '#');
        }
        if ($el.is('button')) {
          $el.attr('type', 'button');
        }
      });
    });
  }

  function intercept(event) {
    var trigger = event.target;
    if (!trigger) return;

    var actuator = trigger.closest ? trigger.closest('.ko-accordion-actuator') : null;
    if (!actuator) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();

    activateFromElement(actuator);
    return false;
  }

  function init() {
    neutralizeLinks();

    document.addEventListener('click', intercept, true);
    document.addEventListener('touchend', intercept, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(jQuery);
