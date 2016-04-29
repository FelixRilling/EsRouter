"use strict";

(function(location, window) {

    let esRouter = class {
        constructor(
            nodeList = [],
            events = {
                before: null,
                done: null,
                fail: null,
                always: null
            },
            options = {
                ajax: false,
                slug: {
                    preSlash: true,
                    urlFragmentInitator: "#",
                    urlFragmentAppend: ""
                }
            }
        ) {
            this.sections = nodeList;
            this.events = events;
            this.options = options;
            this.slug = (options.slug.preSlash ? "/" : "") + options.slug.urlFragmentInitator + options.slug.urlFragmentAppend;

            this.active = null;
            this.activeId = null;
            this.defaultId = null;

            if (typeof this.sections[0] === "undefined") {
                throw new Error("Sections undefined! are section datasets bound?");
            }

            this.init();
        }


        //Initialize & move to url slug
        init() {
            this.defaultId = (this.findData(
                this.sections,
                "sectionDefault",
                "true"
            )).dataset.routerId;

            var slug = this.getSlug();
            console.log("Router: init", slug);
            this.moveTo(slug);
        }

        //main move-to-id
        moveTo(id) {
            this.events.before(id, this);

            this.activeId = id;
            console.log("Router: move", this.activeId);
            this.setSlug(id);
            if (!this.toggleActiveSection(id)) {
                //if not found revert to default
                console.log("Router: error: #" + id + " not found");
                this.moveTo(this.defaultId);
            }
            this.callback(this.activeId, this.active, this.getCurrentIndex());
            return id;
        }

        moveForward() {
            this.movePaginated(-1);
        }

        moveBackward() {
            this.movePaginated(1);
        }

        movePaginated(val) {
            var index = this.getCurrentIndex();
            if (typeof this.sections[index + val] !== "undefined") {
                this.moveTo(
                    this.sections[index + val].dataset["routerId"]
                );
            }
        }

        toggleActiveSection(id) {
            this.iterateDomNode(this.sections, function(e) {
                e.classList.remove("active");
            });

            var newSection = this.findData(this.sections, "routerId", id);
            if (typeof newSection !== "undefined") {
                newSection.classList.add("active");
                this.active = newSection;
                return true;
            } else {
                return false;
            }
        }
        /*##############/
        / Slug functions
        /###############*/
        getSlug() {
            var index = location.href.lastIndexOf(this.slug);
            if (index > -1) {
                return location.href.substr(location.href.lastIndexOf(this.slug) + 2);
            } else {
                this.initSlug(this.defaultId);
                return this.getSlug();
            }
        }
        setSlug(id) {
            location.href = (location.href.substr(0, location.href.lastIndexOf(this.slug) + 2) + id);
        }
        initSlug(id) {
            location.href = location.href + "#" + id;
        }

        /*##############/
        / Utility functions
        /###############*/
        getCurrentIndex() {
            return this.getElementIndex(this.sections, this.active);
        }
        getElementIndex(nodelist, node) {
            var result;
            this.iterateDomNode(nodelist, function(x, i) {
                if (x === node) {
                    result = i;
                }
            });
            return result;
        }
        findData(node, data, val) {
            var result;
            this.iterateDomNode(node, function(x) {
                if (x.dataset[data] === val) {
                    result = x;
                }
            });
            return result;
        }
        iterateDomNode(nodelist, fn) {
            for (var i = 0; i < nodelist.length; i++) {
                fn(nodelist[i], i);
            }
        }
    };

    //Export
    window.esRouter = esRouter;
})(location, window);
