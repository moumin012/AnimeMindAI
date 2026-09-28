import zlib
import struct
import math

def create_png(width, height, is_maskable=False):
    # RGBA image buffer
    raw_data = bytearray()
    
    # Colors
    c_green_top = (30, 161, 80, 255)      # #1ea150
    c_green_bot = (13, 105, 50, 255)      # #0d6932
    c_white = (255, 255, 255, 255)
    c_gold = (245, 158, 11, 255)          # #f59e0b
    c_blue = (56, 189, 248, 255)          # #38bdf8
    c_transparent = (0, 0, 0, 0)
    
    # Padding / margin depending on maskable
    margin_ratio = 0.15 if is_maskable else 0.08
    m = int(width * margin_ratio)
    
    rx = width * 0.18
    
    for y in range(height):
        # Scanline filter byte (0 = None)
        raw_data.append(0)
        for x in range(width):
            # Check rounded rect boundary
            in_rect = False
            # Normalized coords within icon box
            nx = (x - m) / (width - 2 * m)
            ny = (y - m) / (height - 2 * m)
            
            if 0.0 <= nx <= 1.0 and 0.0 <= ny <= 1.0:
                # Check corners
                cx = min(max(nx * 100, 18), 82)
                cy = min(max(ny * 100, 18), 82)
                dist = math.hypot(nx * 100 - cx, ny * 100 - cy)
                if dist <= 18:
                    in_rect = True
            
            if is_maskable:
                in_rect = True # fill whole square for maskable
                
            if in_rect:
                # Gradient background
                t = (y / height)
                r = int(c_green_top[0] * (1 - t) + c_green_bot[0] * t)
                g = int(c_green_top[1] * (1 - t) + c_green_bot[1] * t)
                b = int(c_green_top[2] * (1 - t) + c_green_bot[2] * t)
                
                # Draw symbol in center (cap & book)
                # Cap top diamond: center at 50%, 36%
                px = (x / width) * 100
                py = (y / height) * 100
                
                # Graduation cap top diamond
                # top (50, 26), right (76, 37), bot (50, 48), left (24, 37)
                d1 = abs((px - 50) / 26) + abs((py - 37) / 11)
                
                # Book pages at bottom: (32, 54) to (68, 72)
                in_book = False
                if 53 <= py <= 72 and 30 <= px <= 70:
                    if (px <= 48 and py >= 55 + (px - 30)*0.1) or (px >= 52 and py >= 55 + (70 - px)*0.1):
                        in_book = True
                        
                # AI Sparkle at top right (74, 25)
                dist_sparkle = math.hypot(px - 74, py - 25)
                
                if dist_sparkle <= 5:
                    if dist_sparkle <= 2:
                        raw_data.extend(c_white)
                    else:
                        raw_data.extend(c_blue)
                elif d1 <= 1.0:
                    raw_data.extend(c_white)
                elif in_book:
                    raw_data.extend((255, 255, 255, 230))
                elif 37 <= py <= 56 and 70 <= px <= 76:
                    # Tassel
                    raw_data.extend(c_gold if py >= 52 else c_white)
                else:
                    raw_data.extend((r, g, b, 255))
            else:
                raw_data.extend(c_transparent)
                
    # Build PNG chunks
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xffffffff)
        
    png = b"\x89PNG\r\n\x1a\n"
    # IHDR
    ihdr = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += chunk(b"IHDR", ihdr)
    # IDAT
    compressed = zlib.compress(bytes(raw_data), 9)
    png += chunk(b"IDAT", compressed)
    # IEND
    png += chunk(b"IEND", b"")
    
    return png

# Generate icons
sizes = [
    ("public/pwa-64x64.png", 64, False),
    ("public/pwa-192x192.png", 192, False),
    ("public/pwa-512x512.png", 512, False),
    ("public/maskable-icon-192x192.png", 192, True),
    ("public/maskable-icon-512x512.png", 512, True),
    ("public/apple-touch-icon.png", 180, False),
    ("public/favicon-32x32.png", 32, False),
    ("public/favicon-16x16.png", 16, False),
]

for path, size, maskable in sizes:
    data = create_png(size, size, maskable)
    with open(path, "wb") as f:
        f.write(data)
    print(f"Generated {path} ({size}x{size})")
