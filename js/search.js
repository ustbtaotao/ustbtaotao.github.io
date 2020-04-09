/**
 * Created by ustbtaotao on 17/5/17.
 */
// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
//

var searchFunc = function (path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "json",
        success: function (jsonData) {
            // get the contents from search data
            var datas = jsonData;
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);

            var str = '<ul class=\"search-result-list\">';
            var keywords = $input.value.trim().toLowerCase();
            $resultContent.innerHTML = "";
            if ($input.value.trim().length <= 0) {
                return;
            }
            // perform local searching
            datas.forEach(function (data) {
                var isMatch = true;
                var content_index = [];
                if (!data.title || data.title.trim() === '') {
                    data.title = "Untitled";
                }
                var data_title = data.title.trim().toLowerCase();
                var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                var data_url = data.url;
                var index_title = -1;
                var index_content = -1;
                var first_occur = -1;
                // only match artiles with not empty contents
                if (data_content !== '') {
                    index_title = data_title.indexOf(keywords);
                    index_content = data_content.indexOf(keywords);

                    if (index_title < 0 && index_content < 0) {
                        isMatch = false;
                    } else {
                        if (index_content < 0) {
                            index_content = 0;
                        }
                        // content_index.push({index_content:index_content, keyword_len:keyword_len});
                    }
                } else {
                    isMatch = false;
                }
                // show search results
                if (isMatch) {
                    str += "<li><a href='" + data_url + "' class='search-result-title' style='color: #310202;text-decoration: underline;'>" + data_title + "</a>";
                    var content = data.content.trim().replace(/<[^>]+>/g, "");
                    if (index_title >= 0 || index_content >= 0) {
                        // cut out 10 characters
                        var start = index_content > 0 ? index_content - 5 : 0;
                        if (start <= 0) {
                            start = 0;
                        }

                        var match_content = content.substr(start, 15);
                        // highlight all keywords
                        var regS = new RegExp(keywords, "gi");
                        match_content = match_content.replace(regS, "<em class=\"search-keyword\"><code>" + keywords + "</code></em>");
                        str += "<p class=\"search-result\">" + match_content + "...</p>"
                    }
                    str += "</li>";
                }
            });
            str += "</ul>";
            if (str == '<ul class=\"search-result-list\"></ul>') {
                $($resultContent).hide();
            } else {
                $($resultContent).show();
                $resultContent.innerHTML = str;
            }
        }
    });
}
