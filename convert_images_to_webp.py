#!/usr/bin/env python3
"""
PNG 图片批量转 WebP 脚本
用法: python3 convert_images_to_webp.py [目录] [质量]
  目录: 默认 assets/images
  质量: 默认 82 (0-100, 越高越清晰, 文件越大)
"""
import os
import sys
import concurrent.futures
from PIL import Image


def convert_one(png_path, quality=82):
    """转换单张 PNG -> WebP"""
    webp_path = os.path.splitext(png_path)[0] + '.webp'

    # 如果 WebP 已存在且比 PNG 新，跳过
    if os.path.exists(webp_path) and os.path.getmtime(webp_path) > os.path.getmtime(png_path):
        return ('skip', png_path, 0, 0)

    try:
        original_size = os.path.getsize(png_path)
        img = Image.open(png_path)

        # 处理透明通道
        if img.mode in ('P', 'LA'):
            img = img.convert('RGBA')

        img.save(webp_path, 'WEBP', quality=quality, method=4)
        webp_size = os.path.getsize(webp_path)

        # 如果 WebP 没更小，删除它，保留 PNG
        if webp_size >= original_size:
            os.remove(webp_path)
            return ('skip', png_path, original_size, original_size)

        return ('ok', png_path, original_size, webp_size)
    except Exception as e:
        return ('error', png_path, 0, str(e))


def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 else 'assets/images'
    quality = int(sys.argv[2]) if len(sys.argv) > 2 else 82

    # 收集所有 PNG 文件
    png_files = []
    for dirpath, _, filenames in os.walk(target_dir):
        for f in filenames:
            if f.lower().endswith('.png'):
                png_files.append(os.path.join(dirpath, f))

    if not png_files:
        print('没有找到 PNG 文件，无需转换。')
        return

    print(f'找到 {len(png_files)} 张 PNG，开始并发转换 (quality={quality})...')

    converted = skipped = errors = 0
    total_orig = total_webp = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(convert_one, p, quality): p for p in png_files}

        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            status, path, orig, result = future.result()
            name = os.path.basename(path)

            if status == 'ok':
                converted += 1
                total_orig += orig
                total_webp += result
                savings = (1 - result / orig) * 100
                print(f'  [{i}/{len(png_files)}] {name}: {orig // 1024}KB -> {result // 1024}KB ({savings:.0f}%)')
            elif status == 'skip':
                skipped += 1
                if i % 50 == 0 or i == len(png_files):
                    print(f'  [{i}/{len(png_files)}] 已转换 {converted} 张，跳过 {skipped} 张')
            else:
                errors += 1
                print(f'  错误: {name} - {result}')

    print(f'\n=== 完成 ===')
    print(f'成功: {converted}, 跳过: {skipped}, 错误: {errors}')
    if total_orig > 0:
        print(f'原始: {total_orig // 1024}KB -> WebP: {total_webp // 1024}KB')
        print(f'节省: {(total_orig - total_webp) // 1024}KB ({(1 - total_webp / total_orig) * 100:.1f}%)')


if __name__ == '__main__':
    main()
