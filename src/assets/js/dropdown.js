;(function ($, window, document, undefined) {
'use strict';

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')();
    

$.fn.dropdown = function (parameters) {
    var $allModules = $(this),
    $document = $(document);

    var time = new Date().getTime();
    var performance = [];

    $allModules
    .each(function(elementIndex) {

        var settings = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dropdown.settings, parameters)
          : $.extend({}, $.fn.dropdown.settings);

        var keys = settings.keys;
        var className = settings.className;

        var namespace = settings.namespace,
        eventNamespace = '.' + namespace,
        moduleNamespace = 'module-' + namespace;

        var selector = settings.selector;
        var $module = $(this);
        
        var $search = $module.children(selector.search);
        var $menu = $module.children(selector.menu);
        var $items = $menu.children(selector.item);

        var element = this;

        var elementNamespace,
        id;

        var instance = $module.data(moduleNamespace);

        var module = {
            initialize: function () {
                module.debug('initializing dropdown', settings);
                module.create.id();
                module.bind.events();

                module.instantiate();
            },
            instantiate: function() {
                module.debug('Storing instance of dropdown', module);
                instance = module;
                $module.data(moduleNamespace, module);
            },
            destroy: function () {
                //module.debug('Destroying previous dropdown', $module);
                $module
                    .off(eventNamespace)
                    .removeData(moduleNamespace);

                $menu.off(eventNamespace);
                $document.off(elementNamespace);
            },
            create: {
                id: function() {
                    id = (Math.random().toString(16) + '000000000').substr(2, 8);
                    elementNamespace = '.' + id;
                    module.debug('Creating unique id for element', id);
                }
            },
            bind: {
                events: function () {
                    module.bind.keyboardEvents();
                    module.bind.mouseEvents();
                },
                keyboardEvents: function () {
                    module.debug('Binding keyboard events');
                    $module.on('keydown' + eventNamespace, module.event.keydown);
                    // if the input is for search purpose
                    // todo:
                    // if (module.has.search()) {
                    //     $module.on(module.get.inputEvents() + eventNamespace, selector.search, module.event.input);
                    // }
                },
                mouseEvents: function () {
                    module.debug('Binding mouse events');
                    $menu.on('click' + eventNamespace, module.event.item.click);
                    if (settings.on === 'click') {
                        $search.on('click' + eventNamespace, module.toggle);
                    }

                    $document.on('click', module.test.hide)
                }
            },
            test: {
                hide: function (event) {
                    // TODO: abstract this event out
                    var $target = $(event.target),
                    inDocument = ($target.closest(document.documentElement).length > 0),
                    inModule = ($target.closest($module).length > 0);
                    if(inDocument && !inModule) {
                        module.debug('hide module');
                        module.hide();
                        return true;
                    } else {
                        module.debug('Event occurred in dropdown, canceling callback');
                        return false;
                    }
                }
            },
            set: {
                scrollPosition: function($item, forceScroll) {
                    var
                      edgeTolerance = 5,
                      $menu,
                      hasActive,
                      offset,
                      itemOffset,
                      menuOffset,
                      menuScroll,
                      menuHeight,
                      abovePage,
                      belowPage;
        
                    $item       = $item || module.get.selectedItem();
                    $menu       = $item.closest(selector.menu);
                    hasActive   = ($item && $item.length > 0);
                    forceScroll = (forceScroll !== undefined)
                      ? forceScroll
                      : false
                    ;
                    if($item && $menu.length > 0 && hasActive) {
                      itemOffset = $item.position().top;

                      menuScroll = $menu.scrollTop();
                      menuOffset = $menu.offset().top;
                      itemOffset = $item.offset().top;
                      offset     = menuScroll - menuOffset + itemOffset;
                      if(!forceScroll) {
                        menuHeight = $menu.height();
                        belowPage  = menuScroll + menuHeight < (offset + edgeTolerance);
                        abovePage  = ((offset - edgeTolerance) < menuScroll);
                      }
                      module.debug('Scrolling to active item', offset);
                      if(forceScroll || abovePage || belowPage) {
                        $menu.scrollTop(offset);
                      }
                    }
                  },
                  selectItem: function ($item) {
                      module.debug('Setting user selection to item', $item);
                      $items.removeClass('selected');
                      $item.addClass('selected');
                      $search.val($item.text());
                      $search.text($item.text());
                  }
            },
            event: {
                item: {
                    click: function (event) {
                        var $target = $(event.target);
                        module.set.selectItem($target);
                        module.toggle();
                    }
                },
                keydown: function (event) {
                    var pressedKey = event.which;
                    var isShortcutKey = module.is.inObject(pressedKey, keys);
                    if (isShortcutKey && module.is.focusedOnSearch) {
                        module.debug(event);
                        var $currentlySelected = $items.not(selector.unselectable).filter('.' + className.selected).eq(0);
                        var $activeItem = $menu.children('.' + className.active).eq(0);
                        var $selectedItem = ($currentlySelected.length > 0) ? $currentlySelected : $activeItem;
                        var $visibleItems = ($selectedItem.length > 0)
                        ? $selectedItem.siblings(':not(.' + className.filtered +')').addBack()
                        : $menu.children(':not(.' + className.filtered +')');

                        var inVisibleMenu = ($menu.css('opacity') == 1);
                        var hasSelectedItem = $selectedItem.length > 0;
                        var $nextItem;

                        if (pressedKey == keys.upArrow) {
                            $nextItem = (hasSelectedItem && inVisibleMenu) 
                            ? $selectedItem.prevAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                            : $items.eq(0);

                            if ($visibleItems.index( $nextItem ) < 0) {
                                module.debug('Up key pressed but reached top of current menu');
                                event.preventDefault();
                                return;
                            } else {
                                module.debug('Up key pressed, changing active item');
                                $selectedItem.removeClass(className.selected);
                                $nextItem.addClass(className.selected);
                                module.set.scrollPosition($nextItem);
                                if(settings.selectOnKeydown && module.is.single()) {
                                    module.set.selectItem($nextItem);
                                }
                            }
                            event.preventDefault();
                        }

                        if(pressedKey == keys.downArrow) {
                            $nextItem = (hasSelectedItem && inVisibleMenu)
                              ? $selectedItem.nextAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                              : $items.eq(0)
                            ;
                            if($nextItem.length === 0) {
                              module.debug('Down key pressed but reached bottom of current menu');
                              event.preventDefault();
                              return;
                            }
                            else {
                              module.debug('Down key pressed, changing active item');
                              $selectedItem.removeClass(className.selected);
                              $nextItem.addClass(className.selected);
                              module.set.scrollPosition($nextItem);
                              if(settings.selectOnKeydown && module.is.single()) {
                                module.set.selectItem($nextItem);
                              }
                            }
                            event.preventDefault();
                        }
                    }
                }
            },
            get: {
                inputEvents: function () {
                    var input = $search[0];
                    if(input) {
                        return  (input.oninput !== undefined) ? 'input' : (input.onpropertychange !== undefined) ? 'propertychange': 'keyup';
                    }
                    return false;
                },
                selectedItem: function () {
                    var $selectedItem = $items.not(selector.unselectable).filter('.'  + className.selected);
                    return ($selectedItem.length > 0) ? $selectedItem : $items.eq(0);
                }
            },
            has: {
                search: function () {
                    return ($search.length > 0);
                }
            },
            is: {
                inObject: function (needle, object) {
                    var found = false;
                    $.each(object, function(index, property) {
                    if(property == needle) {
                        found = true;
                        return true;
                    }
                    });
                    return found;
                },
                focusedOnSearch: function () {
                    return (document.activeElement === $search[0]);
                },
                visible: function () {
                    return $search.hasClass('active');
                },
                multiple: function () {
                    // will support in the future
                    return $module.hasClass(className.multiple);
                },
                single: function () {
                    return !module.is.multiple();
                }
            },
            debug: function() {
                if(!settings.silent && settings.debug) {
                    if(settings.performance) {
                        module.performance.log(arguments);
                    }
                    else {
                    module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
                    module.debug.apply(console, arguments);
                    }
                }
            },
            performance: {
                log: function(message) {
                  var
                    currentTime,
                    executionTime,
                    previousTime
                  ;
                  if(settings.performance) {
                    currentTime   = new Date().getTime();
                    previousTime  = time || currentTime;
                    executionTime = currentTime - previousTime;
                    time          = currentTime;
                    performance.push({
                      'Name'           : message[0],
                      'Arguments'      : [].slice.call(message, 1) || '',
                      'Element'        : element,
                      'Execution Time' : executionTime
                    });
                  }
                  clearTimeout(module.performance.timer);
                  module.performance.timer = setTimeout(module.performance.display, 500);
                },
                display: function() {
                  var
                    title = settings.name + ':',
                    totalTime = 0
                  ;
                  time = false;
                  clearTimeout(module.performance.timer);
                  $.each(performance, function(index, data) {
                    totalTime += data['Execution Time'];
                  });
                  title += ' ' + totalTime + 'ms';
                  if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
                    console.groupCollapsed(title);
                    if(console.table) {
                      console.table(performance);
                    }
                    else {
                      $.each(performance, function(index, data) {
                        console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                      });
                    }
                    console.groupEnd();
                  }
                  performance = [];
                }
            },
            show: function () {
                $module.addClass('active');
            },
            hide: function () {
                $module.removeClass('active');
            },
            toggle: function () {
                if (!$module.hasClass('disabled')) {
                    $module.toggleClass('active');
                }
            }
        }
        // initialize
        if (instance !== undefined) {
            // todo
            //instance.destroy();
        }
        module.initialize();
    });

    return $allModules;
};

$.fn.dropdown.settings = {
    name: 'Dropdown',
    silent: false,
    debug: true,
    performance: true,
    namespace: 'dropdown',
    on: 'click',
    selectOnKeydown: true,
    keys: {
        backspace: 8,
        delimiter: 188, // comma
        deleteKey: 46,
        enter: 13,
        escape: 27,
        pageUp: 33,
        pageDown: 34,
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40
    },
    selector: {
        search: '.dropdown__placeholder',
        menu: '.dropdown__menu',
        item: '.dropdown__item',
        unselectable: '.disabled'
    },
    className: {
        selected: 'selected',
        active: 'active',
        filtered: 'filtered',
        multiple: 'multiple'
    }
}

})(jQuery, window, document);