function escape2Html(str) {
    let textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

function html2escape(html) {
    let div = document.createElement("div");
    div.innerText = html;
    return div.innerHTML;
}

function search(inputId, outputId) {
    let _input = document.getElementById(inputId);
    let _output = document.getElementById(outputId);
    _input.addEventListener('input', function () {
        let _searchJson = window.localStorage.getItem("search_json");
        if (!_searchJson) {
            loadSearchJson(null,false);
            _searchJson = window.localStorage.getItem("search_json");
        }
        let _result = JSON.parse(_searchJson);
        if (!_input || !_output) { return; }
        let _keywords = null;
        if (this.value) {
            _keywords = html2escape(this.value.toLowerCase()).split(/\s/);
            for (let i = 0; i < _keywords.length; i++) {
                _result = searchKeyword(_result, _keywords[i]);
            }
            output(_output, _keywords, _result);
        } else {
            _output.innerHTML = '';
        }
    });
}

function searchKeyword(contents, keyword) {
    if (!keyword) { return contents; }
    let temp = new Array();
    for (let i = 0; i < contents.length; i++) {
        if (contents[i].title.toLowerCase().indexOf(keyword) >= 0 || contents[i].content.toLowerCase().indexOf(keyword) >= 0) {
            temp.push(contents[i]);
        }
    }
    return temp;
}


function highlight(content, keywords) {
    let str = '';
    for (let i = 0; i < keywords.length; i++) {
        if (!keywords[i]) { continue; }
        str += keywords[i];
        str += '|';
    }
    str = str.substring(0, str.length - 1);
    let regex = new RegExp(str, 'gi');
    content = content.replace(regex, (m) => {
        return '<em class=\"search-keyword\">' + m + '</em>'
    });
    return content;
}

function item(result, keywords) {
    let _title = result.title;
    let _content = result.content;
    let _item = '<li><a href=\"' + result.url + '\" class=\"search-result-title\">' + highlight(_title, keywords) + '</a>';
    let _first = _content.indexOf(keywords[0]);
    if (_first >= 0) {
        _content = subContent(_content, _first - 20, _first + 280);
        _item += '<p class=\"search-result\">' + highlight(_content, keywords) + '...</p>';
    } else {
        _item += '<p class=\"search-result\">' + highlight(subContent(result.content, 0, 300), keywords) + '...</p>';
    }
    _item += '</li>';
    return _item;
}

function output(output, keywords, results) {
    let _html = '<ul class=\"search-result-list\">';
    for (let i = 0; i < results.length; i++) {
        _html += item(results[i], keywords);
    }
    _html += '</ul>';
    output.innerHTML = _html;
}

function subContent(content, start, end) {
    if (start < 0) { start = 0 }
    if (end > content.length) { end = content.length; }
    return content.substring(start, end);
}

function loadSearchJson(path,sync) {
    if(!path){
        path = '/search.json';
    }
    if(!sync){
        sync = true;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, sync);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
        if (this.status == 200) {
            let data = xhr.response;
            window.localStorage.setItem("search_json", data);
        }
    }
    xhr.send();
}