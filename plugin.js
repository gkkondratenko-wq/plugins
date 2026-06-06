(function () {
    'use strict';

    var API = 'http://192.168.1.2:3000/api';

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
            .then(function (r) { return r.json(); })
            .then(function (data) {
                Lampa.Load.hide();

                var list = data.results.map(function (item) {
                    return {
                        title: item.title,
                        description: String(item.year || ''),
                        onSelect: function () {
                            openItem(item);
                        }
                    };
                });

                Lampa.Select.show({
                    title: 'Результаты',
                    items: list
                });
            })
            .catch(function () {
                Lampa.Load.hide();
                Lampa.Noty.show('Сервер недоступен');
            });
    }

    function openItem(item) {
        fetch(API + '/item?id=' + item.id)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var list = data.sources.map(function (src) {
                    return {
                        title: src.name,
                        description: src.quality,
                        onSelect: function () {
                            Lampa.Platform.openUrl(src.url);
                        }
                    };
                });

                Lampa.Select.show({
                    title: 'Источники',
                    items: list
                });
            });
    }

    Lampa.Noty.show('Мой онлайн-плагин запущен');

    setTimeout(function () {
        openSearch();
    }, 1000);

})();
