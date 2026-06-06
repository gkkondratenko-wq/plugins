(function () {
    'use strict';

    var API = 'http://localhost:3000/api';

    function startPlugin() {
        Lampa.Noty.show('Мой плагин запущен');

        setTimeout(function () {
            openSearch();
        }, 1000);
    }

    function openSearch() {
        Lampa.Input.edit({
            title: 'Поиск фильма',
            free: true
        }, function (q) {
            if (!q) return;
            search(q);
        });
    }

    function search(q) {
        Lampa.Load.show();

        fetch(API + '/search?q=' + encodeURIComponent(q))
            .then(function (r) {
                return r.json();
            })
            .then(function (data) {
                Lampa.Load.hide();

                var list = [];

                data.results.forEach(function (item) {
                    list.push({
                        title: item.title,
                        description: item.year + '',
                        onSelect: function () {
                            openItem(item);
                        }
                    });
                });

                Lampa.Select.show({
                    title: 'Результаты',
                    items: list
                });
            })
            .catch(function () {
                Lampa.Load.hide();
                Lampa.Noty.show('Ошибка подключения к серверу');
            });
    }

    function openItem(item) {
        fetch(API + '/item?id=' + item.id)
            .then(function (r) {
                return r.json();
            })
            .then(function (data) {
                var list = [];

                data.sources.forEach(function (src) {
                    list.push({
                        title: src.name,
                        description: src.quality,
                        onSelect: function () {
                            Lampa.Platform.openUrl(src.url);
                        }
                    });
                });

                Lampa.Select.show({
                    title: 'Источники',
                    items: list
                });
            });
    }

    startPlugin();

})();
