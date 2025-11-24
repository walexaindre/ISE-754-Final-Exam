import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import julia from 'highlight.js/lib/languages/julia';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);
hljs.registerLanguage('julia', julia);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json)

function postprocessHighlightedCode(code: string): string {
    return code
        .split("\n")
        .map((line: string) => `<pre><code>${line}</code></pre>`)
        .join("");
}

onmessage = (event) => {
    let data = event.data as { filename: string, code: string }[];
    const out = data.map(item => hljs.highlightAuto(item.code).value).map(result => postprocessHighlightedCode(result));
    postMessage(out);
};