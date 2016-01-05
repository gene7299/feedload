/*
*  RSS Reader via Google json
*  Author: gene.chang
*/
(function (object) {

    object.fn.ReadFeedAndRender = function (rss_option,render_options) {

        var option = {
            direction: "none",
            FeedUrl: "",
			HostUrl: "",
            MaxCount: 10,
            ShowDesc: false,
            ShowPubDate: false,
            ShowcontentSnippet: false,
			RandomNum: 0,
            DescCharacterLimit: 200,
            TitleLinkTarget: "_blank",
            Template: "%E2%96%B2%20%5BTitle%5D%26nbsp%3B%5BDate%5D%26nbsp%3B%5BDescription%5D",//<![CDATA[▲ [Title]&nbsp;[Date]&nbsp;[Description]]]>
        };
        if (rss_option) {
            object.extend(option, rss_option)
        }
        if(option.FeedUrl.length == 0)
        {
        	//console.log("There is no FeedUrl to parse!");
			return;
        }
        var r = object(this).attr("id");
        var i = 0;
        //object("#" + r).empty().append('<div style="padding:3px;"><img src="loader.gif" /></div>');
        //var url2 = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + option.MaxCount + "&output=json&q=" + encodeURIComponent(option.FeedUrl) + "&hl=en&callback=?";
        //console.log(url2);
        option.FeedUrl = decodeURIComponent(option.FeedUrl);
        //console.log(option.FeedUrl);
        //option.FeedUrl = "http://rss.cnn.com/rss/edition.rss";
        host_language = 'en';
        //scoring=h
        //alert(option.HostUrl);
        object.ajax({
        	type: 'GET',
        	timeout:5000,
            url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + option.MaxCount + "&output=json&q=" + encodeURIComponent(option.FeedUrl) + "&hl="+ host_language +"&callback=?",
            dataType: "jsonp",

            //url:  option.HostUrl + "feedload.php?num=" + option.MaxCount + "&q=" + encodeURIComponent(option.FeedUrl),
            //dataType: "json",

            cache: false,
            contentType: 'application/json',
            success: function (data) {
            	//console.log(JSON.stringify(data));
                //console.log(navigator.language);
            	var toRssArray = new Array();
            	var templateHTML = decodeURIComponent(option.Template);
            	templateHTML = templateHTML.replace("<![CDATA[", "").replace("]]>", "");
            	//console.log(templateHTML);
            	var j = 0;
            	var aItemHtml = "";
            	var aDesciprtHtml = "";
            	var boldTitle = true;
                var breakline = "<br/>";
                if(option.ShowDesc == false && option.ShowPubDate == false && option.ShowcontentSnippet == false)
                {
                    boldTitle = false;
                }
                if (option.direction == "left" || option.direction == "right")
                {
                    breakline = "";
                }else
                {
                    breakline = "<br/>";
                }
                //var s = "";
            	object.each(data.responseData.feed.entries, function (object, data) {
            		aItemHtml = templateHTML;
                    if(boldTitle == true)
                    {
                        aItemHtml = aItemHtml.replace("[Title]","<span style='font-weight:bold'>"+data.title+"</span>");
                    }else
                    {
                        aItemHtml = aItemHtml.replace("[Title]",data.title);
                    }
            		if (option.ShowPubDate)
            		{
                        var date = new Date(data.publishedDate);
                        var YMD = [date.getDate(), date.getMonth()+1, date.getFullYear()];
                        var TIME = [date.getHours(),date.getMinutes(),date.getSeconds()];
                        data.publishedDate = YMD.join('/') + " " + TIME.join(':');
                        //console.log(data.publishedDate);
            			aItemHtml = aItemHtml.replace("[Date]",breakline+data.publishedDate);
                        //alert(data.publishedDate.toLocaleString());
            		} else
                    {
                        aItemHtml = aItemHtml.replace("[Date]","");
                    }
            		if (option.ShowDesc) {
	            		if (option.DescCharacterLimit > 0 && data.content.length > option.DescCharacterLimit) {
	            				aDesciprtHtml = data.content.substr(0, option.DescCharacterLimit);
                    	}else
	            		{
	            				aDesciprtHtml = data.content;
	            		}
                        aItemHtml = aItemHtml.replace("[Description]",breakline+aDesciprtHtml);
                        aItemHtml = aItemHtml.replace("[Content]",breakline+aDesciprtHtml);
	            	}else
                    {
                        aItemHtml = aItemHtml.replace("[Description]","");
                        aItemHtml = aItemHtml.replace("[Content]","");
                    }

                    //aItemHtml = aItemHtml.replace("[PermaLink]",data.link);
                    //temHtml = aItemHtml.replace("[Copyright]",data.author);
                    aItemHtml = aItemHtml.replace("[contentSnippet]",data.contentSnippet);
            		toRssArray[j] = aItemHtml;
            		j++;
            	});
            	////console.log("toRssArray:"+toRssArray[0]);
            	//console.log("toRssArray.length:"+toRssArray.length);
            	//outputArray = toRssArray;
            	//console.log("direction:",render_options.direction);
            	//console.log("scaleMode:",render_options.scaleMode);
            	// Start to render this object
            	//object("#" + r).empty(); //Empty the object;
            	if(render_options.itemsSideBySide==true)
            	{
            		object("#"+r).append('<style type="text/css"> .item, .page { float: left; }</style>');
            	}
            	object("#" + r).Render_rss(render_options, toRssArray); //pass to anyfunction to show
            }
        })
    }
})(jQuery)
