import os
import fitz # PyMuPDF

SOURCES_DIR = r"c:\Users\Shohruh\Desktop\NURQissaAI\data\sources\qissalar"
PUBLIC_STORIES_DIR = r"c:\Users\Shohruh\Desktop\NURQissaAI\public\stories"

os.makedirs(PUBLIC_STORIES_DIR, exist_ok=True)

def extract_storybook_pages():
    # Extract key high-res page images from top books
    books_to_extract = [
        ("Aqilli bola Yusuf.pdf", "yusuf", [0, 1, 3, 5]),
        ("Allohning chin do’sti - nuur-uz.pdf", "ibrohim", [0, 3, 4, 6]),
        ("Bolalar uchun 40 hadis hikoyalari-nuur.pdf", "hadis", [0, 6, 7, 8]),
        ("Nuh payg'ambar qissasi - nuur.pdf", "nuh", [0, 2, 4]),
        ("Muso payg'ambar qissasi.pdf.pdf", "muso", [0, 2, 4]),
    ]
    
    extracted = []
    for pdf_name, prefix, pages in books_to_extract:
        pdf_path = os.path.join(SOURCES_DIR, pdf_name)
        if not os.path.exists(pdf_path):
            print(f"Topilmadi: {pdf_name}")
            continue
            
        print(f"Rasmlar olinmoqda: {pdf_name}...")
        try:
            doc = fitz.open(pdf_path)
            for page_idx in pages:
                if page_idx < len(doc):
                    page = doc[page_idx]
                    # Render page at 2x resolution for crisp sharpness
                    pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
                    out_name = f"{prefix}_page_{page_idx}.png"
                    out_path = os.path.join(PUBLIC_STORIES_DIR, out_name)
                    pix.save(out_path)
                    extracted.append(f"/stories/{out_name}")
                    print(f"   -> Saqlandi: {out_name}")
            doc.close()
        except Exception as e:
            print(f"   -> Xatolik: {e}")
            
    print(f"\nJami {len(extracted)} ta yuqori sifatli sahifa suratlari public/stories/ ga saqlandi!")

if __name__ == "__main__":
    extract_storybook_pages()
