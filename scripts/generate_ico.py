import struct
import zlib
import math
import os

def create_png(width, height):
    raw_data = bytearray()
    c_green_top = (30, 161, 80, 255)      # #1ea150
    c_green_bot = (13, 105, 50, 255)      # #0d6932
    c_white = (255, 255, 255, 255)
    c_gold = (245, 158, 11, 255)          # #f59e0b
    c_blue = (56, 189, 248, 255)          # #38bdf8
    c_transparent = (0, 0, 0, 0)
    
    margin_ratio = 0.08
    m = int(width * margin_ratio)
    
    for y in range(height):
        raw_data.append(0) # filter None
        for x in range(width):
            nx = (x - m) / max(1, (width - 2 * m))
            ny = (y - m) / max(1, (height - 2 * m))
            
            in_rect = False
            if 0.0 <= nx <= 1.0 and 0.0 <= ny <= 1.0:
                cx = min(max(nx * 100, 18), 82)
                cy = min(max(ny * 100, 18), 82)
                dist = math.hypot(nx * 100 - cx, ny * 100 - cy)
                if dist <= 18:
                    in_rect = True
            
            if in_rect:
                t = (y / height)
                r = int(c_green_top[0] * (1 - t) + c_green_bot[0] * t)
                g = int(c_green_top[1] * (1 - t) + c_green_bot[1] * t)
                b = int(c_green_top[2] * (1 - t) + c_green_bot[2] * t)
                
                px = (x / width) * 100
                py = (y / height) * 100
                
                d1 = abs((px - 50) / 26) + abs((py - 37) / 11)
                
                in_book = False
                if 53 <= py <= 72 and 30 <= px <= 70:
                    if (px <= 48 and py >= 55 + (px - 30)*0.1) or (px >= 52 and py >= 55 + (70 - px)*0.1):
                        in_book = True
                        
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
                    raw_data.extend(c_gold if py >= 52 else c_white)
                else:
                    raw_data.extend((r, g, b, 255))
            else:
                raw_data.extend(c_transparent)
                
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xffffffff)
        
    png = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += chunk(b"IHDR", ihdr)
    compressed = zlib.compress(bytes(raw_data), 9)
    png += chunk(b"IDAT", compressed)
    png += chunk(b"IEND", b"")
    return png

def build_ico(sizes, output_path):
    images = []
    for s in sizes:
        png_data = create_png(s, s)
        images.append((s, s, png_data))
        
    num_images = len(images)
    header = struct.pack("<HHH", 0, 1, num_images)
    
    entries = []
    offset = 6 + (16 * num_images)
    
    for w, h, data in images:
        b_w = 0 if w == 256 else w
        b_h = 0 if h == 256 else h
        entry = struct.pack("<BBBBHHII", b_w, b_h, 0, 0, 1, 32, len(data), offset)
        entries.append(entry)
        offset += len(data)
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(header)
        for e in entries:
            f.write(e)
        for _, _, data in images:
            f.write(data)
            
    print(f"Created ICO: {output_path} with sizes {sizes}")

# Generate
sizes = [16, 32, 48, 64, 128, 256]
build_ico(sizes, "public/icon.ico")
build_ico(sizes, "build/icon.ico")
build_ico(sizes, "public/favicon.ico")
