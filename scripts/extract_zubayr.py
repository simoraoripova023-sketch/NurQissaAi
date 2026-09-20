import os
import pymupdf

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
pdf_path = os.path.join(BASE_DIR, "data", "sources", "qissalar", "Odam payg'ambar qissasi - nuur tarjimonlar guruhi (1).pdf")
out_dir = os.path.join(BASE_DIR, "public", "stories", "zubayr")
os.makedirs(out_dir, exist_ok=True)

if not os.path.exists(pdf_path):
    print("PDF not found at:", pdf_path)
else:
    doc = pymupdf.open(pdf_path)
    print(f"Total pages: {len(doc)}")
    
    # Save cover
    pix_cover = doc[0].get_pixmap(matrix=pymupdf.Matrix(2.0, 2.0))
    pix_cover.save(os.path.join(out_dir, "cover.jpeg"))
    print("Saved cover.jpeg")
    
    # 10 pages mapping
    page_indices = [3, 4, 6, 7, 9, 13, 19, 20, 21, 22]
    for i, idx in enumerate(page_indices, start=1):
        if idx < len(doc):
            pix = doc[idx].get_pixmap(matrix=pymupdf.Matrix(2.0, 2.0))
            out_file = os.path.join(out_dir, f"page_{i}.jpeg")
            pix.save(out_file)
            print(f"Saved page_{i}.jpeg (PDF page {idx+1})")
            
    doc.close()
    print("Zubayr illustrations extracted successfully!")
