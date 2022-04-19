export default class TextSplitter {
    e: HTMLAnchorElement;
    text: string[]
    constructor(v: HTMLAnchorElement) {
        this.e = v;
        this.text = [];
    }

    Empty(): boolean {
        for (let i: number = 0; i < this.text.length; ++i) {
            if (this.text[i].length)
                return false;
        }
        return true;
    }

    Lines(e: HTMLAnchorElement): string[] {
        e = e || this.e;
        this.text.push(e.innerText);
        return this.text;
    }
}