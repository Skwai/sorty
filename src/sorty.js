"use strict";
const defaults = {
    handleClassName: '-placeholder',
    placeholderClassName: '-drag',
    dragend: () => { },
    dragstart: () => { }
};
class Sorty {
    constructor(element, options = {}) {
        this.element = null;
        this.placeholder = null;
        this.handle = null;
        this.options = defaults;
        this.element = element;
        this.dragstart = this.dragstart.bind(this);
        this.dragend = this.dragend.bind(this);
        this.dragmove = this.dragmove.bind(this);
        Object.assign(this.options, options);
        this.bindChildren();
    }
    get children() {
        return Array.from(this.element.children);
    }
    bindChildren() {
        this.children.forEach(el => this.bindChild(el));
    }
    bindChild(el) {
        Object.assign(el.style, { userSelect: 'none' });
        el.addEventListener('mousedown', this.dragstart, false);
    }
    /** Remove */
    orderChildren() {
        this.children.forEach((el, index) => {
            Object.assign(el.style, {
                order: index
            });
        });
    }
    dragstart(ev) {
        this.placeholder = ev.target;
        this.createHandle(ev.target);
        this.options.dragstart(ev);
    }
    dragend(ev) {
        const el = ev.target;
        el.classList.remove(this.options.placeholderClassName);
        this.destroyHandle();
        document.removeEventListener('mousemove', this.dragmove);
        document.removeEventListener('mouseup', this.dragend);
        this.options.dragend(ev);
    }
    dragmove(ev) {
        this.positionHandle(ev);
    }
    createHandle(el) {
        const handle = el.cloneNode(true);
        el.parentNode.insertBefore(handle, el);
        document.addEventListener('mouseup', this.dragend);
        document.addEventListener('mousemove', this.dragmove);
        handle.classList.add(this.options.handleClassName);
        handle.style.position = 'absolute';
        this.handle = handle;
    }
    destroyHandle() {
        this.placeholder = null;
        if (this.handle) {
            this.handle.remove();
        }
    }
    positionHandle(ev) {
        const { handle, placeholder } = this;
        const left = `${placeholder.offsetLeft}px`;
        const top = `${placeholder.offsetTop}px`;
        const { clientX } = ev;
        const w = handle.clientWidth / 2;
        const x = clientX - placeholder.getBoundingClientRect().left - w;
        const transform = `translate(${x}px)`;
        const nearest = this.getNearestChild(clientX);
        const nth = this.children.indexOf(nearest);
        console.log(nth);
        Object.assign(handle.style, {
            top,
            left,
            transform
        });
    }
    getNearestChild(x) {
        return this.children.reduce((prev, curr) => {
            if (!prev) {
                return curr;
            }
            if (x > curr.getBoundingClientRect().left) {
                return curr;
            }
            return prev;
        }, null);
    }
}
//# sourceMappingURL=sorty.js.map