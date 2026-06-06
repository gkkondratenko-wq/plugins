(function () {
    'use strict';

    const API = 'http://localhost:3000/api';

    Lampa.Plugins.add('my_server_plugin', function () {

        function start() {
            openSearch();
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
                .then(r => r.json())
                .then(data => {

                    Lampa.Load.hide();
                    showResults(data.results);
                });
        }

        function showResults(items) {

            let list = items.map(item => ({
                title: item.title,
                description: item.year,
                onSelect: function () {
                    openItem(item);
                }
            }));

            Lampa.Select.show({
                title: 'Результаты',
                items: list
            });
        }

        function openItem(item) {

            fetch(API + '/item?id=' + item.id)
                .then(r => r.json())
                .then(data => {

                    showSources(data.sources);
                });
        }

        function showSources(sources) {

            let list = sources.map(src => ({
                title: src.name,
                description: src.quality,
                onSelect: function () {
                    Lampa.Platform.openUrl(src.url);
                }
            }));

            Lampa.Select.show({
                title: 'Источники',
                items: list
            });
        }

        return {
            start: start,
            destroy: function () {}
        };
    });

})();