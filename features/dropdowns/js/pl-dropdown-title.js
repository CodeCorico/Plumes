(function() {
  'use strict';

  window.Ractive.controller('pl-dropdown-title', function(component, data, el, config, done) {

    data.selected = {
      name: '',
      index: 0
    };
    data.opened = false;

    if (data.titles) {
      $.each(data.titles, function(i) {
        if (this.selected) {
          data.selected.index = i;
          data.selected.name = this.name;
        }
      });
    }

    var dropdownTitle = component({
          plName: 'pl-dropdown-title',
          data: data,
          select: _select
        }),
        _$el = {
          body: $('body'),
          dropdownTitle: $(dropdownTitle.el)
        };

    function _select(indexOrName, fireFunc, callback) {
      if (!dropdownTitle) {
        return;
      }

      fireFunc = typeof fireFunc == 'undefined' ? true : fireFunc;

      var titles = dropdownTitle.get('titles'),
          titleToSelect = null;

      $.each(titles, function(i, title) {
        if (typeof indexOrName == 'string' && indexOrName == title.name) {
          indexOrName = i;
        }

        title.selected = i === indexOrName;

        if (i === indexOrName) {
          titleToSelect = title;
        }
      });

      dropdownTitle.set('titles', titles);

      dropdownTitle.set('selected.index', indexOrName);
      dropdownTitle.set('selected.name', data.titles[indexOrName].name);
      dropdownTitle.set('noAnimation', true);

      setTimeout(function() {
        _close(function() {
          if (fireFunc) {
            titleToSelect.select();
            dropdownTitle.fire('titleSelected', {
              title: titleToSelect
            });
          }

          if (callback) {
            callback();
          }
        });
      });
    }

    function _close(callback) {
      dropdownTitle.fire('close', {
        height: _$el.dropdownTitle.find('.pl-dropdown-title h2').height()
      });

      dropdownTitle.set('noAnimation', false);
      dropdownTitle.set('noCaret', true);
      dropdownTitle.set('opened', false);

      setTimeout(function() {
        dropdownTitle.set('noCaret', false);

        if (callback) {
          callback();
        }
      }, 550);
    }

    function _click() {
      _close();
    }

    dropdownTitle.fireSelected = function() {
      var selected = dropdownTitle.get('selected');

      if (selected) {
        dropdownTitle.fire('titleSelected', {
          title: dropdownTitle.get('titles')[selected.index]
        });
      }
    };

    dropdownTitle.toggle = function() {
      if (data.titles.length < 2) {
        return;
      }

      if (dropdownTitle.get('opened')) {
        _close();
      }
      else {
        dropdownTitle.fire('open', {
          height: _$el.dropdownTitle.find('.pl-dropdown-title h2').height() * (data.titles.length + 1)
        });
        dropdownTitle.set('opened', true);
      }
    };

    dropdownTitle.on('mainClick', function(event) {
      event.original.stopPropagation();
    });

    dropdownTitle.on('toggle', function(event) {
      dropdownTitle.toggle();
      event.original.stopPropagation();
    });

    dropdownTitle.selectApp = function(name, fireFunc, callback) {
      _select(name, fireFunc, callback);

      return dropdownTitle;
    };

    dropdownTitle.addTitle = function(title, indexOrPosition) {
      var titles = dropdownTitle.get('titles');

      indexOrPosition = typeof indexOrPosition == 'undefined' ? titles.length : indexOrPosition;

      if (typeof indexOrPosition == 'string') {
        indexOrPosition = indexOrPosition == 'top' ? 0 : titles.length;
      }

      titles.splice(indexOrPosition, 0, title);

      dropdownTitle.set('titles', titles);

      return dropdownTitle;
    };

    dropdownTitle.removeTitle = function(name) {
      var titles = dropdownTitle.get('titles');

      for (var i = 0; i < titles.length; i++) {
        if (titles[i].name == name) {
          titles.splice(i, 1);
          break;
        }
      }

      dropdownTitle.set('titles', titles);

      return dropdownTitle;
    };

    dropdownTitle.on('teardown', function() {
      _$el.body.unbind('click', _click);
    });

    _$el.body.click(_click);

    done();
  });

})();