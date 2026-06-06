(function () {
    'use strict';

    var API = 'http://192.168.1.2:3000/api';

    function search(q) {
        Lampa.Load.show();

        fetch(API + '/search?q=' + encodeURIComponent(q))
            .then(function (r) { return r.json(); })
            .then(function (data) {
                Lampa.Load.hide();

                var list = data.results.map(function (item) {
                    return {
                        title: item.title,
                        subtitle: String(item.year || ''),
                        onSelect: function () {
                            Lampa.Noty.show('Выбрано: ' + item.title);
                        }
                    };
                });

                Lampa.Select.show({
                    title: 'Тестовые результаты',
                    items: list
                });
            })
            .catch(function () {
                Lampa.Load.hide();
                Lampa.Noty.show('Сервер недоступен');
            });
    }

    Lampa.Noty.show('Плагин запущен');

    setTimeout(function () {
        search('test');
    }, 1000);

})();
