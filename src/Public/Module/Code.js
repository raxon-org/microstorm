let code = {};

code.init = () => {

}

code.ansi_to_html = (input) => {
    const ANSI_REGEX = /\x1b\[([0-9;]+)m/g;

    const styles = {
        0:  () => "</span>",

        // text styles
        1:  () => '<span style="font-weight:bold">',
        3:  () => '<span style="font-style:italic">',
        4:  () => '<span style="text-decoration:underline">',

        // foreground colors
        30: () => '<span style="color:black">',
        31: () => '<span style="color:red">',
        32: () => '<span style="color:green">',
        33: () => '<span style="color:yellow">',
        34: () => '<span style="color:blue">',
        35: () => '<span style="color:magenta">',
        36: () => '<span style="color:cyan">',
        37: () => '<span style="color:white">',

            // bright foreground colors
        90: () => '<span style="color:gray">',
        91: () => '<span style="color:lightcoral">',
        92: () => '<span style="color:lightgreen">',
        93: () => '<span style="color:lightyellow">',
        94: () => '<span style="color:lightskyblue">',
        95: () => '<span style="color:violet">',
        96: () => '<span style="color:lightcyan">',
        97: () => '<span style="color:white">',
    };
    let openSpans = 0;
    const html = input.replace(ANSI_REGEX, (_, codes) => {
        return codes.split(";").map(code => {
            const fn = styles[code];
            if (!fn) return "";
            if (code === "0") {
                const closing = "</span>".repeat(openSpans);
                openSpans = 0;
                return closing;
            }
            openSpans++;
            return fn();
        }).join("");
    });
    return html + "</span>".repeat(openSpans);
}

export { code };