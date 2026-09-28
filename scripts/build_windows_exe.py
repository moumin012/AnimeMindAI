import struct
import time
import os

def create_windows_x64_exe(output_path):
    # Base configuration
    IMAGE_BASE = 0x0000000140000000
    SECTION_ALIGN = 0x1000
    FILE_ALIGN = 0x200
    
    # RVAs
    RVA_TEXT  = 0x1000
    RVA_RDATA = 0x2000
    RVA_DATA  = 0x3000
    
    # --------------------------------------------------------------------------
    # 1. DOS Header & Stub (128 bytes total -> PE Header at 0x80)
    # --------------------------------------------------------------------------
    dos_header = bytearray(128)
    dos_header[0:2] = b'MZ'
    struct.pack_into('<I', dos_header, 0x3C, 0x80) # e_lfanew = 0x80
    
    # Simple DOS Stub
    dos_stub = (
        b'\x0e\x1f\xba\x0e\x00\xb4\x09\xcd\x21\xb8\x01\x4c\xcd\x21'
        b'This program cannot be run in DOS mode.\r\r\n$\x00\x00\x00\x00\x00\x00\x00'
    )
    dos_header[0x40:0x40+len(dos_stub)] = dos_stub
    
    # --------------------------------------------------------------------------
    # 2. Imports and .rdata Section
    # We will import:
    #   KERNEL32.dll: ExitProcess, GetModuleFileNameW
    #   SHELL32.dll: ShellExecuteW
    # --------------------------------------------------------------------------
    # Layout of .rdata:
    # 0x000: IAT for KERNEL32 (ExitProcess, GetModuleFileNameW, 0) -> 24 bytes
    # 0x018: IAT for SHELL32   (ShellExecuteW, 0)                   -> 16 bytes
    # 0x028: Import Directory Table (2 DLLs + 1 null terminator = 3 * 20 = 60 bytes)
    # 0x064: ILT for KERNEL32 (24 bytes)
    # 0x07C: ILT for SHELL32 (16 bytes)
    # 0x090: Hint/Name entries:
    #        - ExitProcess
    #        - GetModuleFileNameW
    #        - ShellExecuteW
    #        - "KERNEL32.dll"
    #        - "SHELL32.dll"
    
    # Offsets within .rdata
    OFF_IAT_K32 = 0x00
    OFF_IAT_SH32 = 0x18
    OFF_IDT = 0x28
    OFF_ILT_K32 = 0x68
    OFF_ILT_SH32 = 0x80
    
    # Hint/Name strings
    OFF_HN_EXIT = 0x90
    HN_EXIT = struct.pack('<H', 0) + b'ExitProcess\x00' # 14 bytes
    
    OFF_HN_GETMOD = OFF_HN_EXIT + len(HN_EXIT) # 0x9E
    HN_GETMOD = struct.pack('<H', 0) + b'GetModuleFileNameW\x00' # 21 bytes
    
    OFF_HN_SHELLEX = OFF_HN_GETMOD + len(HN_GETMOD) # 0xB3
    if OFF_HN_SHELLEX % 2 != 0: OFF_HN_SHELLEX += 1 # align to word
    HN_SHELLEX = struct.pack('<H', 0) + b'ShellExecuteW\x00' # 16 bytes
    
    OFF_STR_K32 = OFF_HN_SHELLEX + len(HN_SHELLEX) # 0xC4
    if OFF_STR_K32 % 2 != 0: OFF_STR_K32 += 1
    STR_K32 = b'KERNEL32.dll\x00' # 13 bytes
    
    OFF_STR_SH32 = OFF_STR_K32 + len(STR_K32) # 0xD2
    if OFF_STR_SH32 % 2 != 0: OFF_STR_SH32 += 1
    STR_SH32 = b'SHELL32.dll\x00' # 12 bytes
    
    rdata_len = OFF_STR_SH32 + len(STR_SH32)
    rdata_sec = bytearray(rdata_len)
    
    # Fill IAT and ILT
    # KERNEL32 IAT & ILT
    rva_hn_exit = RVA_RDATA + OFF_HN_EXIT
    rva_hn_getmod = RVA_RDATA + OFF_HN_GETMOD
    struct.pack_into('<Q', rdata_sec, OFF_IAT_K32, rva_hn_exit)
    struct.pack_into('<Q', rdata_sec, OFF_IAT_K32 + 8, rva_hn_getmod)
    struct.pack_into('<Q', rdata_sec, OFF_IAT_K32 + 16, 0)
    
    struct.pack_into('<Q', rdata_sec, OFF_ILT_K32, rva_hn_exit)
    struct.pack_into('<Q', rdata_sec, OFF_ILT_K32 + 8, rva_hn_getmod)
    struct.pack_into('<Q', rdata_sec, OFF_ILT_K32 + 16, 0)
    
    # SHELL32 IAT & ILT
    rva_hn_shellex = RVA_RDATA + OFF_HN_SHELLEX
    struct.pack_into('<Q', rdata_sec, OFF_IAT_SH32, rva_hn_shellex)
    struct.pack_into('<Q', rdata_sec, OFF_IAT_SH32 + 8, 0)
    
    struct.pack_into('<Q', rdata_sec, OFF_ILT_SH32, rva_hn_shellex)
    struct.pack_into('<Q', rdata_sec, OFF_ILT_SH32 + 8, 0)
    
    # Import Directory Table (IDT)
    # Entry 1: KERNEL32
    # Characteristics (ILT RVA), TimeDateStamp, ForwarderChain, Name RVA, FirstThunk (IAT RVA)
    struct.pack_into('<IIIII', rdata_sec, OFF_IDT,
                     RVA_RDATA + OFF_ILT_K32,
                     0,
                     0,
                     RVA_RDATA + OFF_STR_K32,
                     RVA_RDATA + OFF_IAT_K32)
    
    # Entry 2: SHELL32
    struct.pack_into('<IIIII', rdata_sec, OFF_IDT + 20,
                     RVA_RDATA + OFF_ILT_SH32,
                     0,
                     0,
                     RVA_RDATA + OFF_STR_SH32,
                     RVA_RDATA + OFF_IAT_SH32)
    
    # Entry 3: Null descriptor (20 zero bytes)
    
    # Hint/Name strings
    rdata_sec[OFF_HN_EXIT:OFF_HN_EXIT+len(HN_EXIT)] = HN_EXIT
    rdata_sec[OFF_HN_GETMOD:OFF_HN_GETMOD+len(HN_GETMOD)] = HN_GETMOD
    rdata_sec[OFF_HN_SHELLEX:OFF_HN_SHELLEX+len(HN_SHELLEX)] = HN_SHELLEX
    rdata_sec[OFF_STR_K32:OFF_STR_K32+len(STR_K32)] = STR_K32
    rdata_sec[OFF_STR_SH32:OFF_STR_SH32+len(STR_SH32)] = STR_SH32
    
    # --------------------------------------------------------------------------
    # 3. .data Section (Wide Unicode strings for StudentOS)
    # --------------------------------------------------------------------------
    # In .data we place:
    # 0x00: L"open\0"
    # 0x10: L"dist\\index.html\0"
    # 0x40: Buffer for exe path (520 bytes)
    # 0x250: L"cmd.exe\0"
    # 0x270: L"/c start \"\" \"dist\\index.html\"\0"
    
    data_sec = bytearray(1024)
    def put_wstr(arr, offset, s):
        raw = s.encode('utf-16le') + b'\x00\x00'
        arr[offset:offset+len(raw)] = raw
        return offset + len(raw)
        
    OFF_DATA_OPEN = 0x00
    put_wstr(data_sec, OFF_DATA_OPEN, "open")
    
    OFF_DATA_TARGET = 0x20
    put_wstr(data_sec, OFF_DATA_TARGET, "dist\\index.html")
    
    OFF_DATA_PARAMS = 0x100
    put_wstr(data_sec, OFF_DATA_PARAMS, "")
    
    # --------------------------------------------------------------------------
    # 4. .text Section (x86_64 Machine Code)
    # Calls ShellExecuteW(NULL, L"open", L"dist\\index.html", NULL, NULL, SW_SHOWNORMAL=1)
    # Then calls ExitProcess(0)
    # --------------------------------------------------------------------------
    # Windows x64 ABI:
    # RCX = 1st arg (hwnd = NULL = 0)
    # RDX = 2nd arg (lpOperation = L"open")
    # R8  = 3rd arg (lpFile = L"dist\\index.html")
    # R9  = 4th arg (lpParameters = NULL = 0)
    # [RSP + 0x20] = 5th arg (lpDirectory = NULL = 0)
    # [RSP + 0x28] = 6th arg (nShowCmd = SW_SHOWNORMAL = 1)
    # Call [ShellExecuteW]
    # XOR ECX, ECX
    # Call [ExitProcess]
    
    # ShellExecuteW IAT pointer:
    # RIP relative from call instruction:
    # At call instruction: RIP is next instruction.
    # We will assemble clean position-dependent or RIP-relative code:
    
    text_sec = bytearray()
    
    # sub rsp, 0x38 (allocate shadow space + align stack to 16 bytes: 0x38 + 8 ret = 0x40)
    text_sec.extend(b'\x48\x83\xec\x38')
    
    # xor ecx, ecx (hwnd = 0)
    text_sec.extend(b'\x31\xc9')
    
    # mov rdx, IMAGE_BASE + RVA_DATA + OFF_DATA_OPEN
    text_sec.extend(b'\x48\xba' + struct.pack('<Q', IMAGE_BASE + RVA_DATA + OFF_DATA_OPEN))
    
    # mov r8, IMAGE_BASE + RVA_DATA + OFF_DATA_TARGET
    text_sec.extend(b'\x49\xb8' + struct.pack('<Q', IMAGE_BASE + RVA_DATA + OFF_DATA_TARGET))
    
    # xor r9d, r9d (lpParameters = 0)
    text_sec.extend(b'\x45\x31\xc9')
    
    # mov qword ptr [rsp + 0x20], 0 (lpDirectory = 0)
    text_sec.extend(b'\x48\xc7\x44\x24\x20\x00\x00\x00\x00')
    
    # mov dword ptr [rsp + 0x28], 1 (nShowCmd = SW_SHOWNORMAL = 1)
    text_sec.extend(b'\xc7\x44\x24\x28\x01\x00\x00\x00')
    
    # mov rax, qword ptr [IMAGE_BASE + RVA_RDATA + OFF_IAT_SH32]
    text_sec.extend(b'\x48\xa1' + struct.pack('<Q', IMAGE_BASE + RVA_RDATA + OFF_IAT_SH32))
    
    # call rax
    text_sec.extend(b'\xff\xd0')
    
    # xor ecx, ecx (exit code = 0)
    text_sec.extend(b'\x31\xc9')
    
    # mov rax, qword ptr [IMAGE_BASE + RVA_RDATA + OFF_IAT_K32]
    text_sec.extend(b'\x48\xa1' + struct.pack('<Q', IMAGE_BASE + RVA_RDATA + OFF_IAT_K32))
    
    # call rax
    text_sec.extend(b'\xff\xd0')
    
    # add rsp, 0x38
    text_sec.extend(b'\x48\x83\xc4\x38')
    # ret
    text_sec.extend(b'\xc3')
    
    # Pad sections to FILE_ALIGN (512)
    def pad(arr, align):
        rem = len(arr) % align
        if rem != 0:
            arr.extend(b'\x00' * (align - rem))
        return arr
        
    text_raw = pad(text_sec, FILE_ALIGN)
    rdata_raw = pad(rdata_sec, FILE_ALIGN)
    data_raw = pad(data_sec, FILE_ALIGN)
    
    # --------------------------------------------------------------------------
    # 5. PE Header, Optional Header, and Section Headers
    # --------------------------------------------------------------------------
    pe_header = bytearray()
    pe_header.extend(b'PE\x00\x00') # Signature
    
    # COFF Header (20 bytes)
    coff = struct.pack(
        '<HHIIIHH',
        0x8664, # Machine: AMD64
        3,      # Number of sections (.text, .rdata, .data)
        int(time.time()),
        0,      # PointerToSymbolTable
        0,      # NumberOfSymbols
        240,    # SizeOfOptionalHeader (0xF0 for PE32+)
        0x0022  # Characteristics: EXECUTABLE_IMAGE | LARGE_ADDRESS_AWARE
    )
    pe_header.extend(coff)
    
    # Optional Header (PE32+ 240 bytes)
    # Offsets and sizes
    SIZE_OF_HEADERS = 0x400
    SIZE_OF_IMAGE = 0x4000 # RVA_DATA + 0x1000
    
    opt = bytearray(240)
    struct.pack_into('<H', opt, 0, 0x020B) # Magic: PE32+
    opt[2] = 14 # MajorLinkerVersion
    opt[3] = 0  # MinorLinkerVersion
    struct.pack_into('<I', opt, 4, len(text_raw))   # SizeOfCode
    struct.pack_into('<I', opt, 8, len(rdata_raw) + len(data_raw)) # SizeOfInitializedData
    struct.pack_into('<I', opt, 12, 0)              # SizeOfUninitializedData
    struct.pack_into('<I', opt, 16, RVA_TEXT)       # AddressOfEntryPoint
    struct.pack_into('<I', opt, 20, RVA_TEXT)       # BaseOfCode
    struct.pack_into('<Q', opt, 24, IMAGE_BASE)     # ImageBase
    struct.pack_into('<I', opt, 32, SECTION_ALIGN)  # SectionAlignment (4096)
    struct.pack_into('<I', opt, 36, FILE_ALIGN)     # FileAlignment (512)
    struct.pack_into('<H', opt, 40, 6) # MajorOperatingSystemVersion
    struct.pack_into('<H', opt, 42, 0) # MinorOperatingSystemVersion
    struct.pack_into('<H', opt, 44, 1) # MajorImageVersion
    struct.pack_into('<H', opt, 46, 0) # MinorImageVersion
    struct.pack_into('<H', opt, 48, 6) # MajorSubsystemVersion
    struct.pack_into('<H', opt, 50, 0) # MinorSubsystemVersion
    struct.pack_into('<I', opt, 52, 0) # Win32VersionValue
    struct.pack_into('<I', opt, 56, SIZE_OF_IMAGE) # SizeOfImage
    struct.pack_into('<I', opt, 60, SIZE_OF_HEADERS) # SizeOfHeaders
    struct.pack_into('<I', opt, 64, 0) # CheckSum
    struct.pack_into('<H', opt, 68, 2) # Subsystem: IMAGE_SUBSYSTEM_WINDOWS_GUI
    struct.pack_into('<H', opt, 70, 0x8160) # DllCharacteristics: DYNAMIC_BASE | NX_COMPAT | TERMINAL_SERVER_AWARE
    struct.pack_into('<Q', opt, 72, 0x100000) # SizeOfStackReserve (1MB)
    struct.pack_into('<Q', opt, 80, 0x1000)   # SizeOfStackCommit (4KB)
    struct.pack_into('<Q', opt, 88, 0x100000) # SizeOfHeapReserve (1MB)
    struct.pack_into('<Q', opt, 96, 0x1000)   # SizeOfHeapCommit (4KB)
    struct.pack_into('<I', opt, 104, 0)       # LoaderFlags
    struct.pack_into('<I', opt, 108, 16)      # NumberOfRvaAndSizes
    
    # Data Directories in Optional Header (16 * 8 bytes = 128 bytes, offset 112)
    # Directory 1: Import Table (Index 1 -> offset 112 + 1*8 = 120)
    struct.pack_into('<II', opt, 120, RVA_RDATA + OFF_IDT, 60) # IDT RVA and Size
    
    # Directory 12: IAT Table (Index 12 -> offset 112 + 12*8 = 208)
    struct.pack_into('<II', opt, 208, RVA_RDATA + OFF_IAT_K32, 40) # IAT RVA and Size
    
    pe_header.extend(opt)
    
    # Section Headers (40 bytes each)
    # Section 1: .text
    sec_text = struct.pack(
        '<8sIIIIIIHHI',
        b'.text\x00\x00\x00',
        len(text_sec),     # VirtualSize
        RVA_TEXT,          # VirtualAddress
        len(text_raw),     # SizeOfRawData
        SIZE_OF_HEADERS,   # PointerToRawData
        0, 0, 0, 0,
        0x60000020         # Characteristics: CODE | EXECUTE | READ
    )
    
    # Section 2: .rdata
    sec_rdata = struct.pack(
        '<8sIIIIIIHHI',
        b'.rdata\x00\x00',
        len(rdata_sec),
        RVA_RDATA,
        len(rdata_raw),
        SIZE_OF_HEADERS + len(text_raw),
        0, 0, 0, 0,
        0x40000040         # Characteristics: INITIALIZED_DATA | READ
    )
    
    # Section 3: .data
    sec_data = struct.pack(
        '<8sIIIIIIHHI',
        b'.data\x00\x00\x00',
        len(data_sec),
        RVA_DATA,
        len(data_raw),
        SIZE_OF_HEADERS + len(text_raw) + len(rdata_raw),
        0, 0, 0, 0,
        0xC0000040         # Characteristics: INITIALIZED_DATA | READ | WRITE
    )
    
    pe_header.extend(sec_text)
    pe_header.extend(sec_rdata)
    pe_header.extend(sec_data)
    
    # Assemble full executable file
    full_headers = bytearray(SIZE_OF_HEADERS)
    full_headers[0:128] = dos_header
    full_headers[128:128+len(pe_header)] = pe_header
    
    exe_content = full_headers + text_raw + rdata_raw + data_raw
    
    d = os.path.dirname(output_path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(exe_content)
        
    print(f"Generated Windows x64 Executable: {output_path} ({len(exe_content)} bytes)")

if __name__ == '__main__':
    create_windows_x64_exe("StudentOS-Windows/StudentOS.exe")
    create_windows_x64_exe("StudentOS.exe")
