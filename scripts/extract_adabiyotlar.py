import fitz
import glob
import os
import json

adabiyotlar_dir = r'C:\Users\777\Desktop\adabiyotlar'
output_dir = r'c:\Users\777\Desktop\projects\NurQissaAi\data\extracted_adabiyotlar'
os.makedirs(output_dir, exist_ok=True)

files = glob.glob(os.path.join(adabiyotlar_dir, '*.pdf'))
summary = {}

for f in files:
    name = os.path.basename(f)
    doc = fitz.open(f)
    book_pages = []
    has_images = 0

    for i, page in enumerate(doc):
        t = page.get_text().strip()
        imgs = page.get_images()
        if imgs:
            has_images += len(imgs)
        book_pages.append({
            'page_number': i + 1,
            'text': t,
            'image_count': len(imgs)
        })

    summary[name] = {
        'total_pages': len(doc),
        'total_images': has_images,
        'pages_with_text': sum(1 for p in book_pages if len(p['text']) > 0),
        'pages': book_pages
    }

    # Save individual text
    txt_path = os.path.join(output_dir, name.replace('.pdf', '.txt'))
    with open(txt_path, 'w', encoding='utf-8') as out_f:
        out_f.write(f"KITOB: {name}\nJAMI SAHIFALAR: {len(doc)}\n\n")
        for p in book_pages:
            if p['text']:
                out_f.write(f"=== SAHIFA {p['page_number']} ===\n{p['text']}\n\n")

output_json = os.path.join(output_dir, 'books_analysis.json')
with open(output_json, 'w', encoding='utf-8') as jf:
    json.dump(summary, jf, ensure_ascii=False, indent=2)

print("Analysis saved to:", output_dir)
for k, v in summary.items():
    print(f"- {k}: {v['total_pages']} sahifa, matnli sahifalar: {v['pages_with_text']}, rasmlar: {v['total_images']}")
