import struct

with open("StudentOS-Windows/StudentOS.exe", "rb") as f:
    data = f.read()

print(f"Total size: {len(data)} bytes")
print(f"MZ signature: {data[0:2]}")
e_lfanew = struct.unpack_from("<I", data, 0x3c)[0]
print(f"PE header offset: 0x{e_lfanew:x}")
pe_sig = data[e_lfanew:e_lfanew+4]
print(f"PE signature: {pe_sig}")
machine, num_sections, timedatestamp, _, _, opt_size, characteristics = struct.unpack_from("<HHIIIHH", data, e_lfanew+4)
print(f"Machine: 0x{machine:x} (0x8664 = AMD64)")
print(f"Num sections: {num_sections}")
print(f"Characteristics: 0x{characteristics:x}")

opt_offset = e_lfanew + 24
magic, major_linker, minor_linker, size_code, size_init_data, size_uninit_data, entry_point, base_code = struct.unpack_from("<HBBIIIII", data, opt_offset)
print(f"Optional header magic: 0x{magic:x} (0x20b = PE32+)")
print(f"Entry point RVA: 0x{entry_point:x}")

image_base, sec_align, file_align = struct.unpack_from("<QII", data, opt_offset + 24)
print(f"Image base: 0x{image_base:x}")
print(f"Subsystem: {struct.unpack_from('<H', data, opt_offset + 68)[0]} (2 = GUI)")

sec_offset = opt_offset + opt_size
for i in range(num_sections):
    sec_name, virt_size, virt_addr, raw_size, raw_addr = struct.unpack_from("<8sIIII", data, sec_offset + i*40)
    print(f"Section {i+1}: {sec_name.decode('ascii', errors='ignore').strip(chr(0))} (VirtualAddr: 0x{virt_addr:x}, RawSize: {raw_size})")

print("PE Header verification PASSED successfully!")
