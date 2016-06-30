import $ from 'jquery';

class Template {
    constructor(params) {
        var self = this;
        self.settings = {};
        for(var param in params) {
            self.settings[param] = params[param];
        }

        for (var setting in self.settings) {
            self.route(setting, self.settings[setting]);
        }
        self.route(self.settings);
    }

    route(setting, data) {
        var self = this;
        switch (setting) {
            case "background":
                self.handleBackground(data);
            case "title":
                self.handleTitle(data);
            case "pagination":
                self.handlePagination(data);
            case "answers":
                self.handleAnswers(data);
        }
    }

    handleBackground(data) {
        var layout = {};
        if(data) {
            if(data.color) {
                layout = {"background-color": data.color};
            } else if(data.image) {
                layout = {"background-image": `url(${data.image})`, "background-size": "cover"};
            } else {
                // Default
            }
        }
        $("body").css(layout);
    }

    handleTitle(data) {
        if(data.text) {
            $(".tab-title-content span").html(data.text);
        } else {
            $(".tab-title-content span").html("במה משתמשים כדי להפיק חשמל מאנרגיית הרוח?");
        }

        if(data.icon) {
            this.handleIcon(data.icon);
        }
    }

    handleIcon(data) {
        if(data["background-color"]) {
            if(data["background-color"].length == 2) {
                $(".tab-icon").css("background", "linear-gradient(" + data["background-color"][0] + ","  + data["background-color"][1] + ")");
            } else {
                $(".tab-icon").css("background-color", data["background-color"][0]);
            }
        }

        if(data.source) {
            $(".svg-container").find("svg").after(`
                <img src="icons/${data.source}" alt="">
            `);
            $(".svg-container").find("svg").remove();
        }
    }

    handlePagination(data) {
        if(data.shown === false) {
            $(".tab-position").hide();
            return;
        } else {
            if(data.haystack === 1) {
                $(".tab-position").hide();
                return;
            } else {
                $(".haystack").html(data.haystack);
            }
        }
    }

    handleAnswers(data) {
        if(data.shown === false) {
            $(".tab-answers").hide();
            return;
        } else {
            if(data.array) {
                for(var i = 0;i < data.array.length;i++) {
                    $(".tab-answers").append(`
                        <div class="tab-answer">
                            <div class="tab-answer-container">
                                ${data.array[i]}
                            </div>
                        </div>
                    `);
                }
            }
        }
    }
}

export default Template;
