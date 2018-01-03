interface SortyOptions {
    handleClassName?: string;
    placeholderClassName?: string;
    dragend?(ev: Event): any;
    dragstart?(ev: Event): any;
}
declare const defaults: SortyOptions;
declare class Sorty {
    element: HTMLElement;
    placeholder: HTMLElement;
    placeholderX: number;
    handle: HTMLElement;
    options: SortyOptions;
    constructor(element: HTMLElement, options?: SortyOptions);
    readonly children: HTMLElement[];
    bindChildren(): void;
    bindChild(el: HTMLElement): void;
    dragstart(ev: Event): void;
    dragend(ev: Event): void;
    dragmove(ev: MouseEvent): void;
    createHandle(el: HTMLElement): void;
    destroyHandle(): void;
    positionHandle(ev: MouseEvent): void;
    getNearestChild(x: number): HTMLElement;
}
