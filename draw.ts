const rainbow = img`245768ca`

namespace fancyText {
    export function drawFontText(left: number, top: number, text: string, lines: Line[], defaultColor: number, defaultFont: fancyText.BaseFont, length: number) {
        let currentLeft = left;
        for (const line of lines) {
            currentLeft = left;
            for (const span of line.spans) {
                const font = getFontForSpan(span.flags) || defaultFont;
                const color = getColorForSpan(span.flags) || defaultColor;

                if (font.lineHeight === line.height) {
                    drawFontSpan(currentLeft, top, text.substr(span.offset, span.length), font, color, span.flags, left, length);
                }
                else {
                    drawFontSpan(currentLeft, top + (line.height >> 1) - (font.lineHeight >> 1), text.substr(span.offset, span.length), font, color, span.flags, left, length);
                }

                length -= span.length;
                if (length <= 0) return;

                currentLeft += getTextWidth(font, text, span.offset, span.offset + span.length);
            }
            top += line.height;
        }
    }


    function getColorForSpan(flags: number) {
        if (flags & Tag.Color01) {
            return 1
        }
        if (flags & Tag.Color02) {
            return 2
        }
        if (flags & Tag.Color03) {
            return 3
        }
        if (flags & Tag.Color04) {
            return 4
        }
        if (flags & Tag.Color05) {
            return 5
        }
        if (flags & Tag.Color06) {
            return 6
        }
        if (flags & Tag.Color07) {
            return 7
        }
        if (flags & Tag.Color08) {
            return 8
        }
        if (flags & Tag.Color09) {
            return 9
        }
        if (flags & Tag.Color10) {
            return 10
        }
        if (flags & Tag.Color11) {
            return 11
        }
        if (flags & Tag.Color12) {
            return 12
        }
        if (flags & Tag.Color13) {
            return 13
        }
        if (flags & Tag.Color14) {
            return 14
        }
        if (flags & Tag.Color15) {
            return 15
        }

        return 0;
    }

    function drawFontSpan(left: number, top: number, text: string, font: fancyText.BaseFont, color: number, flags: number, absoluteLeft: number, length: number) {
        if (flags & Tag.Blinking) {
            if (Math.idiv(game.runtime(), 250) % 2 === 0) {
                return;
            }
        }
        if (flags & (Tag.Wavy | Tag.Shaky | Tag.Rainbow)) {
            const width = getTextWidth(font, text) / text.length;

            const tick = Math.idiv(game.runtime(), 100);
            let x = left;

            for (let i = 0; i < text.length; i++) {
                if (i >= length) return;

                let y = top;
                if (flags & Tag.Shaky) {
                    x += randint(-1, 1);
                    y += randint(-1, 1);
                }
                if (flags & Tag.Wavy) {
                    y += Math.sin(((x - absoluteLeft) / 10) + tick) * 2;
                }
                if (flags & Tag.Rainbow) {
                    color = rainbow.getPixel((Math.idiv(x - absoluteLeft, width) + tick) % rainbow.width, 0);
                }
                const char = text.charAt(i);
                const code = text.charCodeAt(i);

                printText(screen, font, char, x, y, color);

                if (char == " " || !font.isInFont(code)) {
                    x += font.wordSpacing;
                }
                else {
                    x += font.charWidth(code) + font.letterSpacing;
                }
            }
        }
        else if (length < text.length) {
            printText(screen, font, text.substr(0, length), left, top, color);
        }
        else {
            printText(screen, font, text, left, top, color);
        }
    }

    function printText(target: Image, font: BaseFont, text: string, x: number, y: number, color: number) {
        const x0 = x;

        let charCode: number;
        let charWidth: number;
        const imgBuf = control.createBuffer(font.bufferSize());
        imgBuf[0] = 0x87
        imgBuf[1] = 1

        for (let i = 0; i < text.length; i++) {
            charCode = text.charCodeAt(i);
            // space
            if (charCode === 32) {
                x += font.wordSpacing;
                continue;
            }
            else if (charCode === 10) {
                y += font.lineHeight;
                x = x0;
                continue;
            }

            if (!font.isInFont(charCode)) {
                target.drawRect(x, y, font.wordSpacing, font.baselineOffset, color);
                x += font.wordSpacing;
                continue;
            }

            charWidth = font.charWidth(charCode);
            if (charWidth === 0) continue;

            target.drawIcon(
                font.writeCharacterBytes(imgBuf, charCode),
                x + font.charXOffset(charCode),
                y + font.baselineOffset + font.charYOffset(charCode),
                color
            );

            x += charWidth + font.letterSpacing;
        }
    }

}
