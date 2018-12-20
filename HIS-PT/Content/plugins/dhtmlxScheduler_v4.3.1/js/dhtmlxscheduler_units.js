﻿scheduler._props = {}, scheduler.createUnitsView = function (e, t, r, s, a, i) {
    "object" == typeof e && (r = e.list, t = e.property, s = e.size || 0, a = e.step || 1, i = e.skip_incorrect, e = e.name), scheduler._props[e] = { map_to: t, options: r, step: a, position: 0 }, s > scheduler._props[e].options.length && (scheduler._props[e]._original_size = s, s = 0), scheduler._props[e].size = s, scheduler._props[e].skip_incorrect = i || !1, scheduler.date[e + "_start"] = scheduler.date.day_start, scheduler.templates[e + "_date"] = function (e) {
        return scheduler.templates.day_date(e)
    }, scheduler._get_unit_index = function (e, t) { var r = e.position || 0, s = Math.floor((scheduler._correct_shift(+t, 1) - +scheduler._min_date) / 864e5); return r + s }, scheduler.templates[e + "_scale_text"] = function (e, t, r) { return r.css ? "<span class='" + r.css + "'>" + t + "</span>" : t }, scheduler.templates[e + "_scale_date"] = function (t) { var r = scheduler._props[e], s = r.options; if (!s.length) return ""; var a = scheduler._get_unit_index(r, t), i = s[a]; return scheduler.templates[e + "_scale_text"](i.key, i.label, i) }, scheduler.date["add_" + e] = function (e, t) {
        return scheduler.date.add(e, t, "day")
    }, scheduler.date["get_" + e + "_end"] = function (t) { return scheduler.date.add(t, scheduler._props[e].size || scheduler._props[e].options.length, "day") }, scheduler.attachEvent("onOptionsLoad", function () {
        for (var t = scheduler._props[e], r = t.order = {}, s = t.options, a = 0; a < s.length; a++) r[s[a].key] = a; t._original_size && 0 === t.size && (t.size = t._original_size, delete t.original_size), t.size > s.length ? (t._original_size = t.size, t.size = 0) : t.size = t._original_size || t.size, scheduler._date && scheduler._mode == e && scheduler.setCurrentView(scheduler._date, scheduler._mode)
    }), scheduler["mouse_" + e] = function (e) { var t = scheduler._props[this._mode]; if (t) { e = this._week_indexes_from_pos(e), this._drag_event || (this._drag_event = {}), this._drag_id && this._drag_mode && (this._drag_event._dhx_changed = !0); var r = Math.min(e.x + t.position, t.options.length - 1); e.section = (t.options[r] || {}).key, e.x = 0; var s = this.getEvent(this._drag_id); this._update_unit_section({ view: t, event: s, pos: e }) } return e.force_redraw = !0, e }, scheduler.callEvent("onOptionsLoad", [])
}, scheduler._update_unit_section = function (e) {
    var t = e.view, r = e.event, s = e.pos;
    r && (r[t.map_to] = s.section)
}, scheduler.scrollUnit = function (e) { var t = scheduler._props[this._mode]; t && (t.position = Math.min(Math.max(0, t.position + e), t.options.length - t.size), this.update_view()) }, function () {
    var e = function (e) { var t = scheduler._props[scheduler._mode]; if (t && t.order && t.skip_incorrect) { for (var r = [], s = 0; s < e.length; s++) "undefined" != typeof t.order[e[s][t.map_to]] && r.push(e[s]); e.splice(0, e.length), e.push.apply(e, r) } return e }, t = scheduler._pre_render_events_table; scheduler._pre_render_events_table = function (r, s) {
        return r = e(r), t.apply(this, [r, s])
    }; var r = scheduler._pre_render_events_line; scheduler._pre_render_events_line = function (t, s) { return t = e(t), r.apply(this, [t, s]) }; var s = function (e, t) { if (e && "undefined" == typeof e.order[t[e.map_to]]) { var r = scheduler, s = 864e5, a = Math.floor((t.end_date - r._min_date) / s); return t[e.map_to] = e.options[Math.min(a + e.position, e.options.length - 1)].key, !0 } }, a = scheduler._reset_scale, i = scheduler.is_visible_events; scheduler.is_visible_events = function (e) {
        var t = i.apply(this, arguments); if (t) {
            var r = scheduler._props[this._mode];
            if (r && r.size) { var s = r.order[e[r.map_to]]; if (s < r.position || s >= r.size + r.position) return !1 }
        } return t
    }, scheduler._reset_scale = function () {
        var e = scheduler._props[this._mode], t = a.apply(this, arguments); if (e) {
            this._max_date = this.date.add(this._min_date, 1, "day"); for (var r = this._els.dhx_cal_data[0].childNodes, s = 0; s < r.length; s++) r[s].className = r[s].className.replace("_now", ""); if (e.size && e.size < e.options.length) {
                var i = this._els.dhx_cal_header[0], n = document.createElement("DIV"); e.position && (n.className = "dhx_cal_prev_button", n.style.cssText = "left:1px;top:2px;position:absolute;", n.innerHTML = "&nbsp;", i.firstChild.appendChild(n), n.onclick = function () {
                    scheduler.scrollUnit(-1 * e.step)
                }), e.position + e.size < e.options.length && (n = document.createElement("DIV"), n.className = "dhx_cal_next_button", n.style.cssText = "left:auto; right:0px;top:2px;position:absolute;", n.innerHTML = "&nbsp;", i.lastChild.appendChild(n), n.onclick = function () { scheduler.scrollUnit(e.step) })
            }
        } return t
    }; var n = scheduler._get_event_sday; scheduler._get_event_sday = function (e) { var t = scheduler._props[this._mode]; return t ? (s(t, e), t.order[e[t.map_to]] - t.position) : n.call(this, e) }; var d = scheduler.locate_holder_day; scheduler.locate_holder_day = function (e, t, r) {
        var a = scheduler._props[this._mode];
        return a && r ? (s(a, r), 1 * a.order[r[a.map_to]] + (t ? 1 : 0) - a.position) : d.apply(this, arguments)
    }; var l = scheduler._time_order; scheduler._time_order = function (e) { var t = scheduler._props[this._mode]; t ? e.sort(function (e, r) { return t.order[e[t.map_to]] > t.order[r[t.map_to]] ? 1 : -1 }) : l.apply(this, arguments) }, scheduler.attachEvent("onEventAdded", function (e, t) { if (this._loading) return !0; for (var r in scheduler._props) { var s = scheduler._props[r]; "undefined" == typeof t[s.map_to] && (t[s.map_to] = s.options[0].key) } return !0 }), scheduler.attachEvent("onEventCreated", function (e, t) {
        var r = scheduler._props[this._mode];
        if (r && t) { var a = this.getEvent(e), i = this._mouse_coords(t); this._update_unit_section({ view: r, event: a, pos: i }), s(r, a), this.event_updated(a) } return !0
    })
}();