settingsLoadedEvent.addHandler(function()
{
    if (getSetting("enabled_scripts").contains("expiration_watcher"))
    {
        ExpirationWatcher =
        {
            // 1000ms * 60s * 60m * 24hr
            post_ttl: 1000 * 60 * 60 * 24,

            bar_colors: new Array('#00C300' ,'#00C800' ,'#00D100' ,'#00D800' ,'#00DF00' ,'#00E600' ,'#00ED00' ,'#00F500' ,'#00FB00' ,'#00FE00' ,'#2AFF00' ,'#7EFF00' ,'#D4FF00' ,'#FEFF00' ,'#FFFF00' ,'#FFEE00' ,'#FFCF00' ,'#FFAA00' ,'#FF9900' ,'#FF9900' ,'#FF8000' ,'#FF4B00' ,'#FF1A00' ,'#FF0000'),

            showExpiration: function(item, id, is_root_post)
            {
                if (is_root_post)
                {
                    var postdate = getDescendentByTagAndClassName(item, "div", "postdate");
                    var expiration_time = ExpirationWatcher.calculateExpirationTime(postdate);

                    var wrap = document.createElement("div");
                    wrap.className = "countdown-wrap";

                    var value = wrap.appendChild(document.createElement("div"));
                    value.className = "countdown-value";

                    ExpirationWatcher.updateExpirationTime(expiration_time, wrap, value);
                    postdate.parentNode.insertBefore(wrap, postdate);
                }

            },

            updateExpirationTime: function(expiration_time, wrap, value)
            {
                var now = Date.now();

                var time_left = expiration_time - now;
                var percent = 100;
                var color = ExpirationWatcher.bar_colors[23];
                var desc = "Expired."
                if (time_left > 0)
                {
                    var total_seconds = Math.round(time_left / 1000);
                    var total_minutes = Math.floor(total_seconds / 60);
                    var total_hours = Math.floor(total_minutes / 60);

                    var minutes = total_minutes % 60;
                    var seconds = total_seconds % 60;

                    var desc = "Expires in " + total_hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.";
                    percent = 100 - Math.floor(100 * time_left / ExpirationWatcher.post_ttl);
                    color = ExpirationWatcher.bar_colors[23 - total_hours];
                }

                wrap.title = desc;
                value.style.backgroundColor = color;
                value.style.width = percent + "%";
            },

            calculateExpirationTime: function(postdate_element)
            {
                // put space between time and AM/PM so it will parse correctly
                var raw_time_string = postdate_element.innerHTML.toUpperCase();
                var pos = raw_time_string.indexOf("AM") + raw_time_string.indexOf("PM")+1;
                raw_time_string = raw_time_string.substring(0,pos) + " " + raw_time_string.substr(pos);

                var post_time = Date.parse(raw_time_string);
                return post_time + ExpirationWatcher.post_ttl;
            }
        }

        processPostEvent.addHandler(ExpirationWatcher.showExpiration);
    }
});
