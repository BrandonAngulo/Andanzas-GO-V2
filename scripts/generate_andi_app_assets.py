"""Generate approved Andi transparency and app-icon derivatives.

The original character render remains untouched. This script only clears the
neutral background trapped between Andi's legs and derives app-ready icons from
that corrected sibling.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "brand" / "andi" / "andi-frontal-512.png"
CORRECTED = ROOT / "public" / "brand" / "andi" / "andi-frontal-512-transparent-v2.png"
APP_MARK = ROOT / "public" / "brand" / "andi" / "andi-app-mark-512.png"
PWA_512 = ROOT / "public" / "pwa-icon-512.png"
PWA_192 = ROOT / "public" / "pwa-icon-192.png"


def clear_trapped_background(image: Image.Image) -> Image.Image:
    corrected = image.convert("RGBA")
    pixels = corrected.load()
    mask = Image.new("L", corrected.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(
        [
            (231, 402),
            (256, 420),
            (281, 402),
            (279, 433),
            (271, 459),
            (278, 491),
            (234, 491),
            (241, 459),
            (233, 433),
        ],
        fill=255,
    )
    mask_pixels = mask.load()

    for y in range(corrected.height):
        for x in range(corrected.width):
            if not mask_pixels[x, y]:
                continue
            red, green, blue, alpha = pixels[x, y]
            neutral = max(red, green, blue) - min(red, green, blue) < 38
            if neutral and max(red, green, blue) > 72:
                pixels[x, y] = (red, green, blue, 0)

    return corrected


def vertical_gradient(size: int) -> Image.Image:
    top = (8, 80, 82)
    bottom = (17, 171, 103)
    background = Image.new("RGBA", (size, size))
    pixels = background.load()
    for y in range(size):
        ratio = y / max(1, size - 1)
        color = tuple(round(a + (b - a) * ratio) for a, b in zip(top, bottom))
        for x in range(size):
            pixels[x, y] = (*color, 255)
    return background


def make_app_mark(andi: Image.Image) -> Image.Image:
    canvas = vertical_gradient(512)
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((42, 30, 470, 458), fill=(214, 255, 225, 32))
    glow_draw.ellipse((78, 66, 434, 422), outline=(255, 196, 34, 90), width=5)
    glow = glow.filter(ImageFilter.GaussianBlur(7))
    canvas.alpha_composite(glow)

    # Keep the complete approved silhouette. A complete mascot remains legible
    # at navigation size and avoids the impression of accidentally cut limbs.
    crop = andi.crop(andi.getbbox())
    crop.thumbnail((402, 462), Image.Resampling.LANCZOS)
    x = (512 - crop.width) // 2
    y = 24

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_alpha = crop.getchannel("A").filter(ImageFilter.GaussianBlur(13))
    shadow_layer = Image.new("RGBA", crop.size, (0, 26, 34, 105))
    shadow_layer.putalpha(shadow_alpha.point(lambda value: round(value * 0.42)))
    shadow.alpha_composite(shadow_layer, (x + 5, y + 11))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(crop, (x, y))

    frame = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle((5, 5, 506, 506), radius=112, outline=(255, 255, 255, 115), width=9)
    canvas.alpha_composite(frame)
    return canvas


def main() -> None:
    original = Image.open(SOURCE)
    corrected = clear_trapped_background(original)
    corrected.save(CORRECTED, optimize=True)

    mark = make_app_mark(corrected)
    mark.save(APP_MARK, optimize=True)
    mark.save(PWA_512, optimize=True)
    mark.resize((192, 192), Image.Resampling.LANCZOS).save(PWA_192, optimize=True)


if __name__ == "__main__":
    main()
