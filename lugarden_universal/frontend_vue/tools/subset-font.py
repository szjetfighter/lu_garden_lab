#!/usr/bin/env python3
"""
字体子集化工具 - 交互式版本
从源字体中提取指定字符，生成小体积子集字体
"""

import sys
import os
import re
import subprocess

def extract_chinese_from_file(filepath: str) -> set:
    """从文件中提取所有中文字符和常用标点"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配中文字符、标点符号
    pattern = r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]'
    chars = set(re.findall(pattern, content))
    
    # 添加常用标点
    punctuation = '，。：；！？、""''（）—…·《》【】'
    for p in punctuation:
        chars.add(p)
    
    return chars

def read_chars(source: str, extract_mode: bool = False) -> str:
    """读取字符，支持文件或直接字符串"""
    if os.path.isfile(source):
        if extract_mode:
            # 从代码文件提取中文
            chars = extract_chinese_from_file(source)
        else:
            # 直接读取字符文件
            with open(source, 'r', encoding='utf-8') as f:
                chars = set(f.read())
        chars.discard('\n')
        chars.discard('\r')
        return ''.join(sorted(chars))
    else:
        # 直接是字符串
        return source

def subset_font(font_path: str, chars: str, output_path: str):
    """使用pyftsubset生成子集字体"""
    # 写入临时字符文件
    temp_chars = '_temp_chars.txt'
    with open(temp_chars, 'w', encoding='utf-8') as f:
        f.write(chars)
    
    try:
        # 调用pyftsubset
        cmd = [
            'pyftsubset', font_path,
            f'--text-file={temp_chars}',
            f'--output-file={output_path}'
        ]
        subprocess.run(cmd, check=True)
        
        # 显示结果
        original_size = os.path.getsize(font_path)
        subset_size = os.path.getsize(output_path)
        
        print(f"✅ 子集化完成!")
        print(f"   字符数: {len(chars)}")
        print(f"   原始: {original_size / 1024 / 1024:.2f} MB")
        print(f"   子集: {subset_size / 1024:.1f} KB")
        print(f"   压缩: {original_size / subset_size:.1f}x")
        print(f"   输出: {output_path}")
        
    finally:
        # 清理临时文件
        if os.path.exists(temp_chars):
            os.remove(temp_chars)

def interactive_mode():
    """交互式模式"""
    print("=" * 50)
    print("🔤 字体子集化工具")
    print("=" * 50)
    print()
    
    # 1. 输入源字体路径
    while True:
        font_path = input("📁 源字体文件路径: ").strip().strip('"')
        if os.path.exists(font_path):
            break
        print(f"   ❌ 找不到文件: {font_path}")
    
    print()
    
    # 2. 输入字符来源
    print("📝 字符来源选项:")
    print("   1. 从文件提取中文字符 (如 .ts/.js/.vue)")
    print("   2. 从字符文件读取 (每个字符)")
    print("   3. 直接输入字符串")
    print()
    
    while True:
        choice = input("   选择 (1/2/3): ").strip()
        if choice in ['1', '2', '3']:
            break
        print("   请输入 1、2 或 3")
    
    if choice == '1':
        while True:
            char_source = input("📄 代码文件路径: ").strip().strip('"')
            if os.path.exists(char_source):
                break
            print(f"   ❌ 找不到文件: {char_source}")
        chars = read_chars(char_source, extract_mode=True)
    elif choice == '2':
        while True:
            char_source = input("📄 字符文件路径: ").strip().strip('"')
            if os.path.exists(char_source):
                break
            print(f"   ❌ 找不到文件: {char_source}")
        chars = read_chars(char_source, extract_mode=False)
    else:
        char_string = input("✏️  输入字符串: ").strip()
        chars = char_string
    
    print(f"\n   ✅ 提取到 {len(set(chars))} 个唯一字符")
    print()
    
    # 3. 输入输出路径
    base, ext = os.path.splitext(font_path)
    default_output = f"{base}-subset{ext}"
    
    output_path = input(f"💾 输出路径 (回车使用默认: {os.path.basename(default_output)}): ").strip().strip('"')
    if not output_path:
        output_path = default_output
    
    print()
    
    # 4. 执行子集化
    subset_font(font_path, chars, output_path)

def main():
    # 如果有命令行参数，使用命令行模式
    if len(sys.argv) >= 3:
        font_path = sys.argv[1]
        char_source = sys.argv[2]
        extract_mode = '--extract' in sys.argv
        
        if len(sys.argv) > 3 and not sys.argv[3].startswith('--'):
            output_path = sys.argv[3]
        else:
            base, ext = os.path.splitext(font_path)
            output_path = f"{base}-subset{ext}"
        
        if not os.path.exists(font_path):
            print(f"❌ 找不到字体文件: {font_path}")
            sys.exit(1)
        
        chars = read_chars(char_source, extract_mode)
        print(f"📝 提取到 {len(chars)} 个唯一字符")
        subset_font(font_path, chars, output_path)
    else:
        # 交互式模式
        interactive_mode()

if __name__ == '__main__':
    main()
