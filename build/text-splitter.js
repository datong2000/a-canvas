export default class TextSplitter {
    e;
    text;
    constructor(v) {
        this.e = v;
        this.text = [];
    }
    Empty() {
        for (let i = 0; i < this.text.length; ++i) {
            if (this.text[i].length)
                return false;
        }
        return true;
    }
    Lines(e) {
        e = e || this.e;
        this.text.push(e.innerText);
        return this.text;
    }
}
